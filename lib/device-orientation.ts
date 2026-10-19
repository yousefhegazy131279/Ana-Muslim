type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };
type OrientationConstructor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
export function headingFromEvent(event: CompassEvent, screenAngle = 0): number | null {
  const webkit = event.webkitCompassHeading;
  if (typeof webkit === 'number' && Number.isFinite(webkit) && (event.webkitCompassAccuracy === undefined || (event.webkitCompassAccuracy >= 0 && event.webkitCompassAccuracy <= 50))) return ((webkit + screenAngle) % 360 + 360) % 360;
  // alpha النسبي ليس اتجاه الشمال؛ لا نحوله إلى قراءة قبلة زائفة.
  if (!event.absolute || event.alpha === null || !Number.isFinite(event.alpha) || event.beta === null || event.gamma === null || Math.abs(event.beta) > 60 || Math.abs(event.gamma) > 60) return null;
  return ((360 - event.alpha + screenAngle) % 360 + 360) % 360;
}
export async function requestCompassPermission(): Promise<void> {
  if (typeof DeviceOrientationEvent === 'undefined') throw new Error('البوصلة غير متاحة في هذا المتصفح. يمكنك استخدام الزاوية نسبةً إلى الشمال.');
  const ctor = DeviceOrientationEvent as OrientationConstructor;
  if (ctor.requestPermission && await ctor.requestPermission() !== 'granted') throw new Error('لم يُمنح إذن البوصلة. يبقى اتجاه القبلة نسبةً إلى الشمال متاحًا.');
}
export function watchCompass(onHeading: (heading: number) => void) {
  const listener = (event: DeviceOrientationEvent) => {
    const angle = window.screen.orientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0;
    const heading = headingFromEvent(event, angle);
    if (heading !== null) onHeading(heading);
  };
  window.addEventListener('deviceorientationabsolute', listener);
  window.addEventListener('deviceorientation', listener);
  return () => { window.removeEventListener('deviceorientationabsolute', listener); window.removeEventListener('deviceorientation', listener); };
}
