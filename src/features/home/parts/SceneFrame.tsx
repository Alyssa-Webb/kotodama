/** Dressing for the Home scene: a tiled eave along its top and a hanging signboard naming the place. */
import './parts.css';

export function SceneEave() {
  return <span className="scene-eave" aria-hidden="true" />;
}

export function PlaceSign({ place }: { place: string }) {
  return <p className="home-place place-sign">{place}</p>;
}
