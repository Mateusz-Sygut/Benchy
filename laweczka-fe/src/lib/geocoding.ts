export interface GeocodingResult {
  city: string;
  country: string;
  fullAddress: string;
}

export const reverseGeocode = async (
  latitude: number, 
  longitude: number,
  t: (key: string) => string
): Promise<GeocodingResult | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BenchyApp/1.0', // Wymagane przez Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.address) {
      return null;
    }

    // Wyciągnij miasto z różnych możliwych pól
    const city = 
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.municipality ||
      data.address.county ||
      t('geocoding.unknownCity');

    const country = data.address.country || t('geocoding.unknownCountry');
    
    // Stwórz pełny adres
    const addressParts = [];
    if (data.address.road) addressParts.push(data.address.road);
    if (data.address.house_number) addressParts.push(data.address.house_number);
    if (city && city !== t('geocoding.unknownCity')) addressParts.push(city);
    if (country && country !== t('geocoding.unknownCountry')) addressParts.push(country);
    
    const fullAddress = addressParts.join(', ');

    return {
      city,
      country,
      fullAddress: fullAddress || t('geocoding.unknownLocation'),
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};

// Funkcja pomocnicza do formatowania miasta dla wyświetlenia
export const formatCityForDisplay = (
  geocodingResult: GeocodingResult | null,
  t: (key: string) => string
): string => {
  if (!geocodingResult) {
    return t('geocoding.unknownCity');
  }
  
  // Jeśli mamy miasto, pokaż je
  if (geocodingResult.city && geocodingResult.city !== t('geocoding.unknownCity')) {
    return geocodingResult.city;
  }
  
  // W przeciwnym razie pokaż kraj
  return geocodingResult.country || t('geocoding.unknownCity');
};
