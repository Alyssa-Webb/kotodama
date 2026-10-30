/** In-memory index over every installed pack: lookups by item, dialogue and node. */
import type { Dialogue, Item, LessonNode, LessonPack, Unit } from '../../schema/pack';
import { toSurface } from '../text/furigana';

export interface IndexedItem {
  item: Item;
  packId: string;
}

export interface NodeRef {
  packId: string;
  packTitle: string;
  unit: Unit;
  unitIndex: number;
  node: LessonNode;
  /** Position in the pack's path (0-based, across units). */
  order: number;
  key: string;
}

export const nodeKey = (packId: string, nodeId: string) => `${packId}/${nodeId}`;

export class PackIndex {
  private items = new Map<string, IndexedItem>();
  private dialogues = new Map<string, Dialogue>();
  private nodeMap = new Map<string, NodeRef>();
  readonly paths: { pack: LessonPack; nodes: NodeRef[] }[] = [];
  /** Node key that introduces each item. */
  private introducedIn = new Map<string, string>();

  constructor(readonly packs: readonly LessonPack[]) {
    for (const pack of packs) {
      const nodes: NodeRef[] = [];
      for (const item of pack.items) this.items.set(item.id, { item, packId: pack.pack.id });
      for (const d of pack.dialogues ?? []) this.dialogues.set(d.id, d);
      let order = 0;
      pack.units.forEach((unit, unitIndex) => {
        for (const node of unit.nodes) {
          const key = nodeKey(pack.pack.id, node.id);
          const ref: NodeRef = {
            packId: pack.pack.id,
            packTitle: pack.pack.title,
            unit,
            unitIndex,
            node,
            order: order++,
            key,
          };
          nodes.push(ref);
          this.nodeMap.set(key, ref);
          for (const id of node.introduces) this.introducedIn.set(id, key);
        }
      });
      this.paths.push({ pack, nodes });
    }
  }

  item(id: string): Item | undefined {
    return this.items.get(id)?.item;
  }
  packOf(itemId: string): string | undefined {
    return this.items.get(itemId)?.packId;
  }
  dialogue(id: string): Dialogue | undefined {
    return this.dialogues.get(id);
  }
  node(key: string): NodeRef | undefined {
    return this.nodeMap.get(key);
  }
  introducingNode(itemId: string): NodeRef | undefined {
    const k = this.introducedIn.get(itemId);
    return k ? this.nodeMap.get(k) : undefined;
  }
  allItems(): Item[] {
    return [...this.items.values()].map((x) => x.item);
  }
  itemsOfKind(kind: Item['kind']): Item[] {
    return this.allItems().filter((i) => i.kind === kind);
  }
  /** Nodes up to and including `key` in its pack's path (used for "introduced so far"). */
  nodesThrough(key: string): NodeRef[] {
    const ref = this.nodeMap.get(key);
    if (!ref) return [];
    return this.paths
      .find((p) => p.pack.pack.id === ref.packId)!
      .nodes.filter((n) => n.order <= ref.order);
  }
}

/** The Japanese text shown for an item (patterns show their first example). */
export function itemJapanese(item: Item): string {
  switch (item.kind) {
    case 'pattern':
      return item.examples[0]?.text ?? item.pattern.replace(/\{\{[^}]+\}\}/g, '＿');
    default:
      return item.text;
  }
}

/** Shortest natural English meaning, capitalized for display. */
export function itemMeaning(item: Item): string {
  const m = item.meanings[0] ?? '';
  return item.kind === 'kana' ? m : m.charAt(0).toUpperCase() + m.slice(1);
}

export function itemLabel(item: Item): string {
  return toSurface(itemJapanese(item));
}
