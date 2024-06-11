

const GEOAPIFY_API_URL = "https://api.geoapify.com/v1"
const GEOAPIFY_API_TOKEN = "dc44242606f34bf69bba442fe959d02e"


export type Feature = {
  geometry: {
    type: string;
    coordinates: string[]
  },
  properties: {
    formatted: string
  }
}

export async function autocomplete(search: string): Promise<Feature[]> {
  const autocompleteUrl = `${GEOAPIFY_API_URL}/geocode/autocomplete?text=${search}&apiKey=${GEOAPIFY_API_TOKEN}&lang=fr&country=France`
  const response = await fetch(autocompleteUrl)
  const result = await response.json()
  return result.features
}