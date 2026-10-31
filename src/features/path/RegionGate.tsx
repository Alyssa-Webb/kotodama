/**
 * The gate where the trail crosses from one story region into the next, so the Path reads as one
 * connected road (reference: the owner's Tripo road diorama). A torii leads from the Dojo into the
 * Bamboo Thicket; a wooden kido town gate leads from the Thicket into the City Market.
 */
export type GateKind = 'torii' | 'kido';

/** Which gate stands at the start of a region, if any (the first region has none). */
export function gateFor(regionId: string): GateKind | null {
  if (regionId === 'bamboo') return 'torii';
  if (regionId === 'market') return 'kido';
  return null;
}

export function RegionGate({ kind, lit }: { kind: GateKind; lit: boolean }) {
  return (
    <div
      className={`region-gate region-gate-${kind} ${lit ? 'is-lit' : 'is-locked'}`}
      aria-hidden="true"
    >
      <span className="region-gate-art" />
    </div>
  );
}
