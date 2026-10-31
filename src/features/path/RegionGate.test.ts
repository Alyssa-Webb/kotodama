import { describe, expect, it } from 'vitest';
import { gateFor } from './RegionGate';

describe('region gates', () => {
  it('puts a torii into the Bamboo Thicket and a town gate into the City Market', () => {
    expect(gateFor('dojo')).toBeNull();
    expect(gateFor('bamboo')).toBe('torii');
    expect(gateFor('market')).toBe('kido');
  });
});
