/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents information about a place, including its name and location.
 */
export interface Place {
  /**
   * The name of the place.
   */
  name: string;
  /**
   * The location of the place.
   */
  location: Location;
}

/**
 * Asynchronously retrieves a list of places based on a search query.
 *
 * @param query The search query to use when retrieving places.
 * @returns A promise that resolves to a list of Place objects.
 */
export async function getPlaces(query: string): Promise<Place[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      name: 'Stanford University',
      location: {
        lat: 37.4275,
        lng: -122.1697,
      },
    },
    {
      name: 'Golden Gate Bridge',
      location: {
        lat: 37.8199,
        lng: -122.4783,
      },
    },
  ];
}
