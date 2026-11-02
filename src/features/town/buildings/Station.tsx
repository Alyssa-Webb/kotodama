/**
 * The Station: present-day Japanese commuter train station in faceted isometric low-poly.
 * Lighting comes consistently from the top-left (top = lightest, left = middle, right = darkest).
 */

interface StationPalette {
  turfTopLight: string;
  turfTopMid: string;
  turfTopShadow: string;
  earthLeftLight: string;
  earthLeftMid: string;
  earthRightDark: string;
  earthRightDeep: string;
  ballastTop: string;
  ballastLeft: string;
  ballastRight: string;
  sleeperTop: string;
  railTop: string;
  railSide: string;
  platTopLight: string;
  platTopMid: string;
  platLeft: string;
  platRight: string;
  safetyTop: string;
  safetyRight: string;
  wallTop: string;
  wallLeft: string;
  wallRight: string;
  wallRecess: string;
  plinthLeft: string;
  plinthRight: string;
  roofTopLight: string;
  roofTopMid: string;
  roofLeft: string;
  roofRight: string;
  canopyTopLight: string;
  canopyTopMid: string;
  canopyLeft: string;
  canopyRight: string;
  steelTop: string;
  steelLeft: string;
  steelRight: string;
  wire: string;
  trainTopLight: string;
  trainTopMid: string;
  trainNoseSlope: string;
  trainLeft: string;
  trainRight: string;
  skirtLeft: string;
  skirtRight: string;
  stripeLeft: string;
  stripeRight: string;
  subStripeLeft: string;
  subStripeRight: string;
  acTop: string;
  acLeft: string;
  acRight: string;
  winGlow: string;
  winGlowBright: string;
  winFrame: string;
  cabGlass: string;
  cabGlassShine: string;
  headlight: string;
  beam: string;
  vendTop: string;
  vendLeft: string;
  vendRight: string;
  vendScreen: string;
  benchTop: string;
  benchLeft: string;
  benchRight: string;
  signFace: string;
  signBand: string;
  foliageTop: string;
  foliageLeft: string;
  foliageRight: string;
  trunkLeft: string;
  trunkRight: string;
}

function stationPalette(lit: boolean): StationPalette {
  if (lit) {
    return {
      turfTopLight: 'color-mix(in srgb, var(--c-success) 46%, var(--c-goldSoft))',
      turfTopMid: 'color-mix(in srgb, var(--c-success) 62%, var(--c-surfaceAlt))',
      turfTopShadow: 'color-mix(in srgb, var(--c-success) 68%, var(--c-fog))',
      earthLeftLight: 'color-mix(in srgb, var(--c-panelEdge) 76%, var(--c-hudBg))',
      earthLeftMid: 'color-mix(in srgb, var(--c-panelEdge) 60%, var(--c-hudBg))',
      earthRightDark: 'color-mix(in srgb, var(--c-gold) 52%, var(--c-hudBg))',
      earthRightDeep: 'color-mix(in srgb, var(--c-gold) 36%, var(--c-hudBg))',
      ballastTop: 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hudBg))',
      ballastLeft: 'color-mix(in srgb, var(--c-fog) 48%, var(--c-hudBg))',
      ballastRight: 'color-mix(in srgb, var(--c-fog) 34%, var(--c-hudBg))',
      sleeperTop: 'color-mix(in srgb, var(--c-goldSoft) 54%, var(--c-fog))',
      railTop: 'color-mix(in srgb, var(--c-hudInk) 72%, var(--c-fog))',
      railSide: 'color-mix(in srgb, var(--c-fog) 28%, var(--c-hudBg))',
      platTopLight: 'color-mix(in srgb, var(--c-goldSoft) 74%, var(--c-fog))',
      platTopMid: 'color-mix(in srgb, var(--c-surfaceAlt) 62%, var(--c-fog))',
      platLeft: 'color-mix(in srgb, var(--c-border) 66%, var(--c-fog))',
      platRight: 'color-mix(in srgb, var(--c-fog) 52%, var(--c-hudBg))',
      safetyTop: 'var(--c-glow)',
      safetyRight: 'color-mix(in srgb, var(--c-glow) 68%, var(--c-gold))',
      wallTop: 'color-mix(in srgb, var(--c-goldSoft) 80%, var(--c-skin))',
      wallLeft: 'color-mix(in srgb, var(--c-skin) 68%, var(--c-panelEdge))',
      wallRight: 'color-mix(in srgb, var(--c-panelEdge) 58%, var(--c-hudBg))',
      wallRecess: 'color-mix(in srgb, var(--c-gold) 38%, var(--c-hudBg))',
      plinthLeft: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hudBg))',
      plinthRight: 'color-mix(in srgb, var(--c-fog) 38%, var(--c-hudBg))',
      roofTopLight: 'color-mix(in srgb, var(--c-success) 50%, var(--c-goldSoft))',
      roofTopMid: 'color-mix(in srgb, var(--c-success) 64%, var(--c-surfaceAlt))',
      roofLeft: 'color-mix(in srgb, var(--c-success) 72%, var(--c-secondary))',
      roofRight: 'color-mix(in srgb, var(--c-success) 52%, var(--c-hudBg))',
      canopyTopLight: 'color-mix(in srgb, var(--c-success) 44%, var(--c-goldSoft))',
      canopyTopMid: 'color-mix(in srgb, var(--c-success) 58%, var(--c-fog))',
      canopyLeft: 'color-mix(in srgb, var(--c-success) 64%, var(--c-secondary))',
      canopyRight: 'color-mix(in srgb, var(--c-success) 46%, var(--c-hudBg))',
      steelTop: 'color-mix(in srgb, var(--c-goldSoft) 68%, var(--c-fog))',
      steelLeft: 'color-mix(in srgb, var(--c-fog) 66%, var(--c-surfaceAlt))',
      steelRight: 'color-mix(in srgb, var(--c-fog) 44%, var(--c-hudBg))',
      wire: 'color-mix(in srgb, var(--c-fog) 54%, var(--c-hudBg))',
      trainTopLight: 'color-mix(in srgb, var(--c-goldSoft) 78%, var(--c-fog))',
      trainTopMid: 'color-mix(in srgb, var(--c-surfaceAlt) 66%, var(--c-fog))',
      trainNoseSlope: 'color-mix(in srgb, var(--c-goldSoft) 68%, var(--c-fog))',
      trainLeft: 'color-mix(in srgb, var(--c-skin) 58%, var(--c-fog))',
      trainRight: 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hudBg))',
      skirtLeft: 'color-mix(in srgb, var(--c-fog) 46%, var(--c-hudBg))',
      skirtRight: 'color-mix(in srgb, var(--c-fog) 30%, var(--c-hudBg))',
      stripeLeft: 'color-mix(in srgb, var(--c-success) 82%, var(--c-glow))',
      stripeRight: 'var(--c-success)',
      subStripeLeft: 'var(--c-glow)',
      subStripeRight: 'color-mix(in srgb, var(--c-glow) 78%, var(--c-gold))',
      acTop: 'color-mix(in srgb, var(--c-goldSoft) 66%, var(--c-fog))',
      acLeft: 'color-mix(in srgb, var(--c-fog) 68%, var(--c-border))',
      acRight: 'color-mix(in srgb, var(--c-fog) 48%, var(--c-hudBg))',
      winGlow: 'var(--c-glow)',
      winGlowBright: 'var(--c-coinShine)',
      winFrame: 'color-mix(in srgb, var(--c-gold) 32%, var(--c-hudBg))',
      cabGlass: 'color-mix(in srgb, var(--c-success) 32%, var(--c-hudBg))',
      cabGlassShine: 'color-mix(in srgb, var(--c-coinShine) 58%, var(--c-fog))',
      headlight: 'var(--c-coinShine)',
      beam: 'color-mix(in srgb, var(--c-glow) 64%, var(--c-coinShine))',
      vendTop: 'color-mix(in srgb, var(--c-goldSoft) 72%, var(--c-panelEdge))',
      vendLeft: 'color-mix(in srgb, var(--c-panelEdge) 76%, var(--c-skin))',
      vendRight: 'color-mix(in srgb, var(--c-gold) 58%, var(--c-hudBg))',
      vendScreen: 'var(--c-coinShine)',
      benchTop: 'color-mix(in srgb, var(--c-panelEdge) 80%, var(--c-goldSoft))',
      benchLeft: 'var(--c-panelEdge)',
      benchRight: 'color-mix(in srgb, var(--c-gold) 58%, var(--c-hudBg))',
      signFace: 'color-mix(in srgb, var(--c-goldSoft) 82%, var(--c-skin))',
      signBand: 'var(--c-success)',
      foliageTop: 'color-mix(in srgb, var(--c-success) 66%, var(--c-glow))',
      foliageLeft: 'var(--c-success)',
      foliageRight: 'color-mix(in srgb, var(--c-success) 54%, var(--c-hudBg))',
      trunkLeft: 'var(--c-panelEdge)',
      trunkRight: 'color-mix(in srgb, var(--c-gold) 52%, var(--c-hudBg))',
    };
  }
  return {
    turfTopLight: 'color-mix(in srgb, var(--c-success) 28%, var(--c-fog))',
    turfTopMid: 'color-mix(in srgb, var(--c-success) 22%, var(--c-fog))',
    turfTopShadow: 'color-mix(in srgb, var(--c-success) 18%, var(--c-hudBg))',
    earthLeftLight: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hudBg))',
    earthLeftMid: 'color-mix(in srgb, var(--c-fog) 48%, var(--c-hudBg))',
    earthRightDark: 'color-mix(in srgb, var(--c-fog) 38%, var(--c-hudBg))',
    earthRightDeep: 'color-mix(in srgb, var(--c-fog) 28%, var(--c-hudBg))',
    ballastTop: 'color-mix(in srgb, var(--c-fog) 50%, var(--c-hudBg))',
    ballastLeft: 'color-mix(in srgb, var(--c-fog) 38%, var(--c-hudBg))',
    ballastRight: 'color-mix(in srgb, var(--c-fog) 26%, var(--c-hudBg))',
    sleeperTop: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hudBg))',
    railTop: 'color-mix(in srgb, var(--c-fog) 70%, var(--c-hudInk))',
    railSide: 'color-mix(in srgb, var(--c-fog) 24%, var(--c-hudBg))',
    platTopLight: 'color-mix(in srgb, var(--c-fog) 66%, var(--c-hudInk))',
    platTopMid: 'color-mix(in srgb, var(--c-fog) 76%, var(--c-hudInk))',
    platLeft: 'color-mix(in srgb, var(--c-fog) 64%, var(--c-hudBg))',
    platRight: 'color-mix(in srgb, var(--c-fog) 42%, var(--c-hudBg))',
    safetyTop: 'color-mix(in srgb, var(--c-glow) 34%, var(--c-fog))',
    safetyRight: 'color-mix(in srgb, var(--c-gold) 32%, var(--c-fog))',
    wallTop: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hudInk))',
    wallLeft: 'color-mix(in srgb, var(--c-fog) 72%, var(--c-hudInk))',
    wallRight: 'color-mix(in srgb, var(--c-fog) 48%, var(--c-hudBg))',
    wallRecess: 'color-mix(in srgb, var(--c-fog) 28%, var(--c-hudBg))',
    plinthLeft: 'color-mix(in srgb, var(--c-fog) 44%, var(--c-hudBg))',
    plinthRight: 'color-mix(in srgb, var(--c-fog) 30%, var(--c-hudBg))',
    roofTopLight: 'color-mix(in srgb, var(--c-success) 28%, var(--c-fog))',
    roofTopMid: 'color-mix(in srgb, var(--c-success) 22%, var(--c-fog))',
    roofLeft: 'color-mix(in srgb, var(--c-success) 30%, var(--c-fog))',
    roofRight: 'color-mix(in srgb, var(--c-success) 26%, var(--c-hudBg))',
    canopyTopLight: 'color-mix(in srgb, var(--c-success) 24%, var(--c-fog))',
    canopyTopMid: 'color-mix(in srgb, var(--c-success) 18%, var(--c-fog))',
    canopyLeft: 'color-mix(in srgb, var(--c-success) 26%, var(--c-fog))',
    canopyRight: 'color-mix(in srgb, var(--c-success) 22%, var(--c-hudBg))',
    steelTop: 'color-mix(in srgb, var(--c-fog) 68%, var(--c-hudInk))',
    steelLeft: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hudBg))',
    steelRight: 'color-mix(in srgb, var(--c-fog) 38%, var(--c-hudBg))',
    wire: 'color-mix(in srgb, var(--c-fog) 44%, var(--c-hudBg))',
    trainTopLight: 'color-mix(in srgb, var(--c-fog) 52%, var(--c-hudInk))',
    trainTopMid: 'color-mix(in srgb, var(--c-fog) 62%, var(--c-hudInk))',
    trainNoseSlope: 'color-mix(in srgb, var(--c-fog) 60%, var(--c-hudInk))',
    trainLeft: 'color-mix(in srgb, var(--c-fog) 68%, var(--c-hudInk))',
    trainRight: 'color-mix(in srgb, var(--c-fog) 54%, var(--c-hudBg))',
    skirtLeft: 'color-mix(in srgb, var(--c-fog) 40%, var(--c-hudBg))',
    skirtRight: 'color-mix(in srgb, var(--c-fog) 26%, var(--c-hudBg))',
    stripeLeft: 'color-mix(in srgb, var(--c-success) 38%, var(--c-fog))',
    stripeRight: 'color-mix(in srgb, var(--c-success) 30%, var(--c-fog))',
    subStripeLeft: 'color-mix(in srgb, var(--c-glow) 34%, var(--c-fog))',
    subStripeRight: 'color-mix(in srgb, var(--c-gold) 30%, var(--c-fog))',
    acTop: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hudInk))',
    acLeft: 'color-mix(in srgb, var(--c-fog) 60%, var(--c-hudBg))',
    acRight: 'color-mix(in srgb, var(--c-fog) 42%, var(--c-hudBg))',
    winGlow: 'color-mix(in srgb, var(--c-fog) 42%, var(--c-hudBg))',
    winGlowBright: 'color-mix(in srgb, var(--c-fog) 52%, var(--c-hudBg))',
    winFrame: 'color-mix(in srgb, var(--c-fog) 28%, var(--c-hudBg))',
    cabGlass: 'color-mix(in srgb, var(--c-fog) 32%, var(--c-hudBg))',
    cabGlassShine: 'color-mix(in srgb, var(--c-fog) 46%, var(--c-hudBg))',
    headlight: 'color-mix(in srgb, var(--c-fog) 54%, var(--c-hudBg))',
    beam: 'color-mix(in srgb, var(--c-fog) 25%, var(--c-hudBg))',
    vendTop: 'color-mix(in srgb, var(--c-fog) 58%, var(--c-hudInk))',
    vendLeft: 'color-mix(in srgb, var(--c-fog) 64%, var(--c-hudBg))',
    vendRight: 'color-mix(in srgb, var(--c-fog) 42%, var(--c-hudBg))',
    vendScreen: 'color-mix(in srgb, var(--c-fog) 48%, var(--c-hudBg))',
    benchTop: 'color-mix(in srgb, var(--c-panelEdge) 38%, var(--c-fog))',
    benchLeft: 'color-mix(in srgb, var(--c-panelEdge) 32%, var(--c-fog))',
    benchRight: 'color-mix(in srgb, var(--c-gold) 30%, var(--c-hudBg))',
    signFace: 'color-mix(in srgb, var(--c-fog) 60%, var(--c-hudInk))',
    signBand: 'color-mix(in srgb, var(--c-success) 34%, var(--c-fog))',
    foliageTop: 'color-mix(in srgb, var(--c-success) 34%, var(--c-fog))',
    foliageLeft: 'color-mix(in srgb, var(--c-success) 40%, var(--c-fog))',
    foliageRight: 'color-mix(in srgb, var(--c-success) 32%, var(--c-hudBg))',
    trunkLeft: 'color-mix(in srgb, var(--c-panelEdge) 40%, var(--c-fog))',
    trunkRight: 'color-mix(in srgb, var(--c-gold) 32%, var(--c-hudBg))',
  };
}

export function Station({ lit }: { lit: boolean }) {
  const p = stationPalette(lit);

  return (
    <g className="station-lowpoly">
      <style>{`
        .station-lowpoly {
          --c-surfaceAlt: var(--c-surface-alt);
          --c-inkMuted: var(--c-ink-muted);
          --c-accentSoft: var(--c-accent-soft);
          --c-secondarySoft: var(--c-secondary-soft);
          --c-goldSoft: var(--c-gold-soft);
          --c-successSoft: var(--c-success-soft);
          --c-panelEdge: var(--c-panel-edge);
          --c-coinShine: var(--c-coin-shine);
          --c-hudInk: var(--c-hud-ink);
          --c-hudBg: var(--c-hud-bg);
        }
        #art-root svg:has(.station-lowpoly) {
          width: 240px;
          height: 192px;
          display: block;
        }
        .station-beam-pulse {
          transform-box: fill-box;
          transform-origin: 85% 30%;
          animation: station-beam-breathe 2.6s ease-in-out infinite alternate;
        }
        @keyframes station-beam-breathe {
          0% { opacity: 0.24; transform: scale(0.96); }
          100% { opacity: 0.56; transform: scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          .station-beam-pulse { animation: none; }
        }
      `}</style>

      {/* === 1. FACETED ISOMETRIC GROUND PATCH === */}
      {/* Multi-faceted grassy top terrace */}
      <polygon points="8,56 38,41 50,47 20,62" fill={p.turfTopLight} />
      <polygon points="38,41 68,26 84,34 50,47" fill={p.turfTopLight} />
      <polygon points="20,62 50,47 66,55 36,70" fill={p.turfTopMid} />
      <polygon points="50,47 84,34 100,42 66,55" fill={p.turfTopMid} />
      <polygon points="36,70 66,55 112,48 52,78" fill={p.turfTopShadow} />
      <polygon points="66,55 100,42 112,48" fill={p.turfTopShadow} />

      {/* Triangulated low-poly earth & stone bevel skirts around island base */}
      <polygon points="8,56 20,62 18,67 10,61" fill={p.earthLeftLight} />
      <polygon points="20,62 36,70 33,76 18,67" fill={p.earthLeftMid} />
      <polygon points="36,70 52,78 52,85 33,76" fill={p.earthLeftLight} />
      <polygon points="52,78 72,68 70,75 52,85" fill={p.earthRightDark} />
      <polygon points="72,68 92,58 90,65 70,75" fill={p.earthRightDeep} />
      <polygon points="92,58 112,48 109,54 90,65" fill={p.earthRightDark} />

      {/* === 2. LOW-POLY TREES & SHRUBS (3-tone faceted triangles) === */}
      {/* Back-left cypress/pine tree trunk */}
      <polygon points="15.5,52.5 18.5,54 18.5,46 15.5,44.5" fill={p.trunkLeft} />
      <polygon points="18.5,54 21.5,52.5 21.5,44.5 18.5,46" fill={p.trunkRight} />
      {/* Tree tier 1 (bottom faceted pyramid) */}
      <polygon points="10.5,45.5 18.5,41.5 18.5,35.5" fill={p.foliageTop} />
      <polygon points="10.5,45.5 18.5,49.5 18.5,35.5" fill={p.foliageLeft} />
      <polygon points="18.5,49.5 26.5,45.5 18.5,35.5" fill={p.foliageRight} />
      {/* Tree tier 2 (middle faceted pyramid) */}
      <polygon points="12,39 18.5,35.5 18.5,29.5" fill={p.foliageTop} />
      <polygon points="12,39 18.5,42.5 18.5,29.5" fill={p.foliageLeft} />
      <polygon points="18.5,42.5 25,39 18.5,29.5" fill={p.foliageRight} />
      {/* Tree tier 3 (crown faceted pyramid) */}
      <polygon points="13.8,33 18.5,30.5 18.5,25" fill={p.foliageTop} />
      <polygon points="13.8,33 18.5,35.5 18.5,25" fill={p.foliageLeft} />
      <polygon points="18.5,35.5 23.2,33 18.5,25" fill={p.foliageRight} />

      {/* Small faceted low-poly shrub beside forecourt */}
      <polygon points="20,57 25,54.5 28.5,56.5 24,53" fill={p.foliageTop} />
      <polygon points="20,57 24.5,59.5 24,53" fill={p.foliageLeft} />
      <polygon points="24.5,59.5 28.5,56.5 24,53" fill={p.foliageRight} />

      {/* === 3. MODERN STATION HOUSE (stepped concourse + tower volume) === */}
      {/* Concrete foundation plinth */}
      <polygon points="23,50.5 38,58 38,55 23,47.5" fill={p.plinthLeft} />
      <polygon points="38,58 66,44 66,41 38,55" fill={p.plinthRight} />

      {/* Main station hall walls (warm sandstone: left middle, right darkest) */}
      <polygon points="23,47.5 38,55 38,39 23,31.5" fill={p.wallLeft} />
      <polygon points="38,55 66,41 66,25 38,39" fill={p.wallRight} />

      {/* Left architectural corner pilaster & horizontal window bay */}
      <polygon points="26,44 35,48.5 35,42 26,37.5" fill={p.winFrame} />
      <polygon points="26.8,43.5 30.6,45.4 30.6,40.4 26.8,38.5" fill={p.winGlowBright} />
      <polygon points="31.2,45.7 34.2,47.2 34.2,42.2 31.2,40.7" fill={p.winGlow} />

      {/* Glazed ticket-gate concourse entrance on front-right facade */}
      <polygon points="40.5,53.7 53,47.5 53,38 40.5,44.2" fill={p.wallRecess} />
      <polygon points="41.5,53.2 46.8,50.6 46.8,39.8 41.5,42.4" fill={p.winGlow} />
      <polygon points="47.5,50.2 52.2,47.9 52.2,39.2 47.5,41.5" fill={p.winGlowBright} />
      {/* Entrance cantilevered modern canopy (top, left fascia, right fascia) */}
      <polygon points="39.5,43.5 53.5,36.5 56.2,37.8 42.2,44.8" fill={p.canopyTopLight} />
      <polygon points="39.5,43.5 42.2,44.8 42.2,46.3 39.5,45" fill={p.canopyLeft} />
      <polygon points="42.2,44.8 56.2,37.8 56.2,39.3 42.2,46.3" fill={p.canopyRight} />

      {/* Row of 4 upper clerestory office windows across station facade */}
      <polygon points="40.5,39.5 45,37.2 45,33.6 40.5,35.9" fill={p.winGlowBright} />
      <polygon points="46.5,36.5 51,34.2 51,30.6 46.5,32.9" fill={p.winGlow} />
      <polygon points="52.5,33.5 57,31.2 57,27.6 52.5,29.9" fill={p.winGlowBright} />
      <polygon points="58.5,30.5 63,28.2 63,24.6 58.5,26.9" fill={p.winGlow} />

      {/* Recessed ticket machine bay on right of entrance */}
      <polygon points="55.5,46.2 63.5,42.2 63.5,35.2 55.5,39.2" fill={p.wallRecess} />
      <polygon points="56.5,44.7 59.5,43.2 59.5,37.6 56.5,39.1" fill={p.vendScreen} />
      <polygon points="60.2,42.8 62.6,41.6 62.6,37 60.2,38.2" fill={p.winGlow} />

      {/* Modern flat cantilevered roof with faceted deck & fascia overhang */}
      <polygon points="21,30.5 51,15.5 59.5,19.8 29.5,34.8" fill={p.roofTopLight} />
      <polygon points="29.5,34.8 59.5,19.8 68,24 38,39" fill={p.roofTopMid} />
      <polygon points="21,30.5 38,39 38,41.4 21,32.9" fill={p.roofLeft} />
      <polygon points="38,39 68,24 68,26.4 38,41.4" fill={p.roofRight} />

      {/* Stepped rooftop skylight monitor + blank architectural station signboard */}
      <polygon points="31,27 47,19 54,22.5 38,30.5" fill={p.wallTop} />
      <polygon points="31,27 38,30.5 38,33.8 31,30.3" fill={p.wallLeft} />
      <polygon points="38,30.5 54,22.5 54,25.8 38,33.8" fill={p.wallRight} />
      <polygon points="41.5,34.2 54.5,27.7 56,28.5 43,35" fill={p.wallTop} />
      <polygon points="41.5,34.2 43,35 43,39.2 41.5,38.4" fill={p.wallLeft} />
      <polygon points="43,35 56,28.5 56,32.7 43,39.2" fill={p.signFace} />
      <polygon points="43,37.7 56,31.2 56,32.7 43,39.2" fill={p.signBand} />

      {/* === 4. RAISED PASSENGER PLATFORM & YELLOW SAFETY LINE === */}
      {/* Concrete platform deck slabs */}
      <polygon points="28,60 56,46 69,52.5 41,66.5" fill={p.platTopLight} />
      <polygon points="56,46 84,32 97,38.5 69,52.5" fill={p.platTopMid} />
      {/* Platform left & right vertical concrete faces */}
      <polygon points="28,60 41,66.5 41,70.2 28,63.7" fill={p.platLeft} />
      <polygon points="41,66.5 97,38.5 97,42.2 41,70.2" fill={p.platRight} />
      {/* Continuous yellow tactile platform edge line along track side */}
      <polygon points="39.4,65.7 95.4,37.7 97,38.5 41,66.5" fill={p.safetyTop} />
      <polygon points="41,66.5 97,38.5 97,39.6 41,67.6" fill={p.safetyRight} />

      {/* === 5. PLATFORM VENDING MACHINE & BENCH === */}
      {/* Beverage vending machine on left platform (3-tone prism + lit display + pickup slot) */}
      <polygon points="35.5,53.5 40.5,51 44.5,53 39.5,55.5" fill={p.vendTop} />
      <polygon points="35.5,53.5 39.5,55.5 39.5,63 35.5,61" fill={p.vendLeft} />
      <polygon points="39.5,55.5 44.5,53 44.5,60.5 39.5,63" fill={p.vendRight} />
      <polygon points="40.2,56.1 43.8,54.3 43.8,57.9 40.2,59.7" fill={p.vendScreen} />
      <polygon points="40.4,60.3 43.6,58.7 43.6,59.8 40.4,61.4" fill={p.winFrame} />

      {/* Faceted wooden/steel platform bench */}
      <polygon points="46,53.5 53,50 56.2,51.6 49.2,55.1" fill={p.benchTop} />
      <polygon points="46,53.5 49.2,55.1 49.2,57.1 46,55.5" fill={p.benchLeft} />
      <polygon points="49.2,55.1 56.2,51.6 56.2,53.6 49.2,57.1" fill={p.benchRight} />
      <polygon points="46,50.8 53,47.3 54.1,47.9 47.1,51.4" fill={p.benchTop} />
      <polygon points="47.1,51.4 54.1,47.9 54.1,50.7 47.1,54.2" fill={p.benchRight} />

      {/* === 6. MODERN PLATFORM CANOPY & HANGING SIGN === */}
      {/* Steel Y-pillars supporting canopy */}
      <polygon points="62,48 63.6,48.8 63.6,37.4 62,36.6" fill={p.steelLeft} />
      <polygon points="63.6,48.8 65.2,48 65.2,36.6 63.6,37.4" fill={p.steelRight} />
      <polygon points="78.5,39.8 80.1,40.6 80.1,29.2 78.5,28.4" fill={p.steelLeft} />
      <polygon points="80.1,40.6 81.7,39.8 81.7,28.4 80.1,29.2" fill={p.steelRight} />
      {/* Hanging blank platform signboard under canopy */}
      <polygon points="68,40 75.4,36.3 75.4,39.3 68,43" fill={p.signFace} />
      <polygon points="68,42 75.4,38.3 75.4,39.3 68,43" fill={p.signBand} />
      {/* Faceted V-wing modern canopy roof (top-left slope, top-right slope, left & right fascias) */}
      <polygon points="54,36 84,21 89.2,23.6 59.2,38.6" fill={p.canopyTopMid} />
      <polygon points="59.2,38.6 89.2,23.6 95,26.5 65,41.5" fill={p.canopyTopLight} />
      <polygon points="54,36 65,41.5 65,43.3 54,37.8" fill={p.canopyLeft} />
      <polygon points="65,41.5 95,26.5 95,28.3 65,43.3" fill={p.canopyRight} />

      {/* === 7. RAILWAY BALLAST BED, SLEEPERS & STEEL RAILS === */}
      {/* Crushed gravel ballast prism */}
      <polygon points="41,70.2 97,42.2 107.6,47.5 51.6,75.5" fill={p.ballastTop} />
      <polygon points="41,70.2 51.6,75.5 49.6,77.3 39,72" fill={p.ballastLeft} />
      <polygon points="51.6,75.5 107.6,47.5 109.4,49.3 49.6,77.3" fill={p.ballastRight} />

      {/* Concrete sleepers across open track sections */}
      <polygon points="43.8,69.8 45.8,68.8 53.2,72.5 51.2,73.5" fill={p.sleeperTop} />
      <polygon points="48.2,67.6 50.2,66.6 57.6,70.3 55.6,71.3" fill={p.sleeperTop} />
      <polygon points="52.6,65.4 54.6,64.4 62,68.1 60,69.1" fill={p.sleeperTop} />
      <polygon points="57,63.2 59,62.2 66.4,65.9 64.4,66.9" fill={p.sleeperTop} />
      <polygon points="92,45.7 94,44.7 101.4,48.4 99.4,49.4" fill={p.sleeperTop} />
      <polygon points="96,43.7 98,42.7 105.4,46.4 103.4,47.4" fill={p.sleeperTop} />

      {/* Twin parallel steel rails */}
      <polygon points="43.5,71.3 99.5,43.3 100.5,43.8 44.5,71.8" fill={p.railTop} />
      <polygon points="44.5,71.8 100.5,43.8 100.5,44.5 44.5,72.5" fill={p.railSide} />
      <polygon points="47.9,73.5 103.9,45.5 104.9,46 48.9,74" fill={p.railTop} />
      <polygon points="48.9,74 104.9,46 104.9,46.7 48.9,74.7" fill={p.railSide} />

      {/* Warm headlight beam facet on tracks ahead of commuter train when lit */}
      {lit && (
        <polygon
          points="58.5,62.2 66.8,66.4 52,73.8 43.8,69.6"
          fill={p.beam}
          opacity="0.38"
          className="station-beam-pulse"
        />
      )}

      {/* === 8. SHORT PRESENT-DAY COMMUTER TRAIN (modern Japanese EMU) === */}
      {/* Undercarriage bogie skirt & coupler pilot */}
      <polygon points="59.8,59.8 69.4,64.6 69.4,62.2 59.8,57.4" fill={p.skirtLeft} />
      <polygon points="69.4,64.6 99.4,49.6 99.4,47.2 69.4,62.2" fill={p.skirtRight} />

      {/* Lower vertical nose face, chamfered aerodynamic upper cab face & passenger side */}
      <polygon points="59.8,57.4 69.4,62.2 69.8,57.2 60.2,52.4" fill={p.trainLeft} />
      <polygon points="60.2,52.4 69.8,57.2 71.4,50.8 61.8,46" fill={p.trainNoseSlope} />
      <polygon points="69.4,62.2 99.4,47.2 99.4,35.8 71.4,50.8 69.8,57.2" fill={p.trainRight} />

      {/* Faceted train roof (sunlit crown + mid slope) */}
      <polygon points="61.8,46 91.8,31 96,33.1 66,48.1" fill={p.trainTopLight} />
      <polygon points="66,48.1 96,33.1 99.4,35.8 71.4,50.8" fill={p.trainTopMid} />

      {/* Iconic emerald-green & gold-amber commuter stripe wrapping nose & side */}
      <polygon points="60,55.8 69.6,60.6 69.8,58.1 60.2,53.3" fill={p.stripeLeft} />
      <polygon points="59.9,56.8 69.5,61.6 69.6,60.6 60,55.8" fill={p.subStripeLeft} />
      <polygon points="69.6,60.6 99.4,45.7 99.4,43.1 69.8,58.1" fill={p.stripeRight} />
      <polygon points="69.5,61.6 99.4,46.7 99.4,45.7 69.6,60.6" fill={p.subStripeRight} />

      {/* Driver's panoramic windshield, diagonal reflection, destination sign & dual headlights */}
      <polygon points="61.1,52.2 68.9,56.1 70.1,51.2 62.3,47.3" fill={p.cabGlass} />
      <polygon points="61.8,51.8 65.2,53.5 66.1,49.8 62.7,48.1" fill={p.cabGlassShine} />
      <polygon points="62.5,47.8 69.3,51.2 69.7,49.7 62.9,46.3" fill={p.winGlowBright} />
      <polygon points="60.8,55.8 62.8,56.8 63,55.3 61,54.3" fill={p.headlight} />
      <polygon points="66.6,58.7 68.6,59.7 68.8,58.2 66.8,57.2" fill={p.headlight} />

      {/* Passenger side: 2 sliding doors + 3 passenger window bays with recessed frames */}
      <polygon points="72,59.4 75.8,57.5 75.8,49.6 72,51.5" fill={p.winFrame} />
      <polygon points="72.6,54.8 75.2,53.5 75.2,50.3 72.6,51.6" fill={p.winGlowBright} />
      <polygon points="77.2,53.4 82.4,50.8 82.4,46.6 77.2,49.2" fill={p.winFrame} />
      <polygon points="77.8,52.7 81.8,50.7 81.8,47.3 77.8,49.3" fill={p.winGlow} />
      <polygon points="83.6,50.2 88.8,47.6 88.8,43.4 83.6,46" fill={p.winFrame} />
      <polygon points="84.2,49.5 88.2,47.5 88.2,44.1 84.2,46.1" fill={p.winGlowBright} />
      <polygon points="90,50.4 93.8,48.5 93.8,40.6 90,42.5" fill={p.winFrame} />
      <polygon points="90.6,45.8 93.2,44.5 93.2,41.3 90.6,42.6" fill={p.winGlow} />
      <polygon points="95,44.5 98.4,42.8 98.4,38.6 95,40.3" fill={p.winGlowBright} />

      {/* Rooftop AC units (two 3-tone low-poly boxes) */}
      <polygon points="68.5,44.4 74.5,41.4 78.2,43.2 72.2,46.2" fill={p.acTop} />
      <polygon points="68.5,44.4 72.2,46.2 72.2,47.9 68.5,46.1" fill={p.acLeft} />
      <polygon points="72.2,46.2 78.2,43.2 78.2,44.9 72.2,47.9" fill={p.acRight} />
      <polygon points="81,38.2 87,35.2 90.7,37 84.7,40" fill={p.acTop} />
      <polygon points="81,38.2 84.7,40 84.7,41.7 81,39.9" fill={p.acLeft} />
      <polygon points="84.7,40 90.7,37 90.7,38.7 84.7,41.7" fill={p.acRight} />

      {/* Rooftop diamond pantograph reaching overhead wire */}
      <polygon points="91.2,34.6 94.8,31 95.6,31.4 92,35" fill={p.steelLeft} />
      <polygon points="94.8,31 92.2,28.5 93,28.1 95.6,30.6" fill={p.steelRight} />

      {/* === 9. OVERHEAD CATENARY MASTS & WIRES === */}
      {/* Back-right catenary mast & cantilevered registration arm */}
      <polygon points="103.4,46 104.8,46.7 104.8,24 103.4,23.3" fill={p.steelLeft} />
      <polygon points="104.8,46.7 106.2,46 106.2,23.3 104.8,24" fill={p.steelRight} />
      <polygon points="92,18.8 104.8,25.2 104.8,26.6 92,20.2" fill={p.steelTop} />

      {/* Front-left catenary mast & cantilevered registration arm */}
      <polygon points="56.4,69.5 57.8,70.2 57.8,47.5 56.4,46.8" fill={p.steelLeft} />
      <polygon points="57.8,70.2 59.2,69.5 59.2,46.8 57.8,47.5" fill={p.steelRight} />
      <polygon points="45,42.3 57.8,48.7 57.8,50.1 45,43.7" fill={p.steelTop} />

      {/* Overhead contact wire & catenary messenger wire facets */}
      <polygon points="51.4,46.5 98.4,23 98.4,23.8 51.4,47.3" fill={p.wire} />
      <polygon points="51.4,44.4 75,33.8 98.4,21 98.4,21.7 75,34.5 51.4,45.1" fill={p.wire} />
    </g>
  );
}
