/**
 * Formats distance in meters to a human-readable string
 * @param meters - Distance in meters
 * @returns Formatted distance string (e.g., "500 m" or "2.3 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = meters / 1000;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}
