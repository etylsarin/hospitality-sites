export interface GeocodingResult {
  center: { lat: number; lng: number };
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  displayName: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string]; // [south, north, west, east]
}

const CACHE_TTL = 60 * 60 * 24 * 30; // 30 days in seconds

/**
 * Server-side geocoding using OpenStreetMap Nominatim (free, no API key required)
 * Results are cached using Next.js data cache for 30 days to reduce API calls.
 * Note: Nominatim has usage policy - max 1 request per second, include User-Agent
 * https://operations.osmfoundation.org/policies/nominatim/
 */
export async function geocodeLocation(
  query: string
): Promise<GeocodingResult | null> {
  if (!query) {
    return null;
  }

  const normalizedQuery = query.toLowerCase().trim();

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(normalizedQuery)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'tastecoffee.eu/1.0 (contact@tastecoffee.eu)',
        },
        next: { revalidate: CACHE_TTL },
      }
    );

    if (!response.ok) {
      console.error('Nominatim API error:', response.status);
      return null;
    }

    const data: NominatimResult[] = await response.json();

    if (!data.length) {
      return null;
    }

    const firstResult = data[0];
    if (!firstResult) {
      return null;
    }

    const { lat, lon, display_name, boundingbox } = firstResult;

    // boundingbox is [south, north, west, east]
    if (!boundingbox || boundingbox.length < 4) {
      return null;
    }
    
    const south = Number(boundingbox[0]);
    const north = Number(boundingbox[1]);
    const west = Number(boundingbox[2]);
    const east = Number(boundingbox[3]);

    return {
      center: { lat: Number(lat), lng: Number(lon) },
      bounds: {
        southwest: { lat: south, lng: west },
        northeast: { lat: north, lng: east },
      },
      displayName: display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}
