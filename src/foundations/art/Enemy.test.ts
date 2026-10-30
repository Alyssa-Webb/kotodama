import { describe, expect, it } from 'vitest';
import { regions } from '../world';
import { foesOf, isEnemyKind } from './Enemy';

describe('region foes', () => {
  it('every region fights at least one foe of its own, not the fallback', () => {
    for (const region of regions) {
      expect(region.foes.filter(isEnemyKind), region.id).not.toHaveLength(0);
    }
  });

  it('the Dojo spars only with trainees', () => {
    const dojo = regions.find((r) => r.id === 'dojo');
    expect(dojo).toBeDefined();
    expect(foesOf(dojo?.foes ?? [])).toEqual(['trainee-bokken', 'trainee-senpai']);
  });

  it('the City Market fights its city yokai', () => {
    const market = regions.find((r) => r.id === 'market');
    expect(foesOf(market?.foes ?? [])).toEqual([
      'chochin-obake',
      'kasa-obake',
      'nopperabo',
      'bakeneko',
    ]);
  });
});
