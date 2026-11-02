/**
 * Mechanical checks on an Argon art run, before anyone reviews it.
 * Usage: npm run art:gate -- <brief-name> [base] [--head <ref>]
 * Compares <base> (default origin/main) with --head (default art/<brief-name>). Exits 1 if anything is flagged.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import {
  findNonComposited,
  findOutsideBrief,
  findRawColors,
  parseAddedLines,
  parseAllowlist,
  type Finding,
} from './gate';

const CHECKED = /\.(tsx|ts|css)$/;
const BRIEF_FOLDERS = [
  '.claude/skills/gemini-art/briefs',
  'shared-context/skills/gemini-art/briefs',
];

function git(...args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

const args = process.argv.slice(2);
const headFlag = args.indexOf('--head');
const headValue = headFlag >= 0 ? args.splice(headFlag, 2)[1] : undefined;
// origin/main, because this checkout pushes straight to it and its local main can be far behind.
const [name, base = 'origin/main'] = args;
if (!name) {
  console.error('Usage: npm run art:gate -- <brief-name> [base] [--head <ref>]');
  process.exit(2);
}
const head = headValue ?? `art/${name}`;

const briefPath = BRIEF_FOLDERS.map((dir) => `${dir}/${name}.md`).find((path) => existsSync(path));
if (!briefPath) {
  console.error(`No brief named ${name} in ${BRIEF_FOLDERS.join(' or ')}`);
  process.exit(2);
}

const allowlist = parseAllowlist(readFileSync(briefPath, 'utf8'));
const range = `${base}...${head}`;
const changed = git('diff', '--name-only', range).split(/\r?\n/).filter(Boolean);
const added = parseAddedLines(git('diff', '-U0', '--diff-filter=d', range));

const findings: Finding[] = findOutsideBrief(changed, allowlist);
if (allowlist.length === 0) {
  findings.push({
    rule: 'outside-brief',
    file: briefPath,
    detail: 'the brief lists no files under "Files you may change"',
  });
}
for (const [file, lines] of added) {
  if (!CHECKED.test(file) || file.endsWith('.test.ts')) continue;
  findings.push(...findRawColors(file, lines));
  const source = git('show', `${head}:${file}`);
  findings.push(...findNonComposited(file, source, new Set(lines.map((l) => l.line))));
}

console.log(`Art gate: ${name} (${range}), ${changed.length} files changed`);
for (const f of findings) {
  console.log(`  ${f.rule}  ${f.file}${f.line ? `:${f.line}` : ''}  ${f.detail}`);
}
console.log(findings.length ? `${findings.length} flagged` : 'Clean');
console.log('Not covered here: off-canvas art and animations set from code (npm run art:sheet).');
process.exit(findings.length ? 1 : 0);
