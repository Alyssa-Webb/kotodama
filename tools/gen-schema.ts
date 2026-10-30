/** Writes lesson-pack.schema.json from the Zod schema (z.toJSONSchema). */
import { writeFileSync } from 'node:fs';
import { z } from 'zod';
import { LessonPackSchema } from '../src/schema/pack';

const schema = z.toJSONSchema(LessonPackSchema, { target: 'draft-2020-12' });
writeFileSync(
  'lesson-pack.schema.json',
  JSON.stringify({ title: 'Kotodama LessonPack 1.0.0', ...schema }, null, 2) + '\n',
);
console.log('wrote lesson-pack.schema.json');
