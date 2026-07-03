export interface GeocodingResult {
  city: string;
  country: string;
  fullAddress: string;
  district?: string | null;
}

interface RawGeocodePayload {
  city: string | null;
  country: string | null;
  district: string | null;
  road: string | null;
  house_number: string | null;
}

const geocodePayloadCache = new Map<string, RawGeocodePayload | null>();

export const geocodeCoordinateCacheKey = (latitude: number, longitude: number): string =>
  `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

function parseRawPayload(data: {
  address?: Record<string, string | undefined>;
}): RawGeocodePayload | null {
  if (!data.address) {
    return null;
  }

  const a = data.address;
  const city =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.county ||
    null;

  const country = a.country || null;
  const district =
    a.suburb || a.city_district || a.neighbourhood || null;
  const road = a.road || null;
  const house_number = a.house_number || null;

  return {
    city,
    country,
    district,
    road,
    house_number,
  };
}

function payloadToResult(payload: RawGeocodePayload, t: (key: string) => string): GeocodingResult {
  const cityDisplay = payload.city || t('geocoding.unknownCity');
  const countryDisplay = payload.country || t('geocoding.unknownCountry');

  const addressParts: string[] = [];
  if (payload.road) addressParts.push(payload.road);
  if (payload.house_number) addressParts.push(payload.house_number);
  if (payload.city) addressParts.push(payload.city);
  if (payload.country) addressParts.push(payload.country);

  const fullAddress =
    addressParts.length > 0 ? addressParts.join(', ') : t('geocoding.unknownLocation');

  return {
    city: cityDisplay,
    country: countryDisplay,
    fullAddress,
    district: payload.district,
  };
}

async function fetchReverseGeocodePayload(
  latitude: number,
  longitude: number
): Promise<RawGeocodePayload | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'BenchyApp/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return parseRawPayload(data);
}

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
  t: (key: string) => string
): Promise<GeocodingResult | null> => {
  const key = geocodeCoordinateCacheKey(latitude, longitude);

  if (geocodePayloadCache.has(key)) {
    const cached = geocodePayloadCache.get(key)!;
    if (cached === null) {
      return null;
    }
    return payloadToResult(cached, t);
  }

  try {
    const payload = await fetchReverseGeocodePayload(latitude, longitude);
    geocodePayloadCache.set(key, payload);
    if (payload === null) {
      return null;
    }
    return payloadToResult(payload, t);
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    geocodePayloadCache.set(key, null);
    return null;
  }
};

export const formatCityForDisplay = (
  geocodingResult: GeocodingResult | null,
  t: (key: string) => string
): string => {
  if (!geocodingResult) {
    return t('geocoding.unknownCity');
  }

  if (geocodingResult.city && geocodingResult.city !== t('geocoding.unknownCity')) {
    return geocodingResult.city;
  }

  return geocodingResult.country || t('geocoding.unknownCity');
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function distanceKm(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) {
    return `${Math.max(1, Math.round(km * 1000))} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}
