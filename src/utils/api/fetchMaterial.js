const baseUrl = process.env.REACT_APP_BASE_URL;

export const navigationData = {
  Acrylic: { image: '/images/acrylic.jpg' },
  Cotton: { image: '/images/cotton.jpg' },
  Denim: { image: '/images/denim.jpg' },
  Jeans: { image: '/images/jeans.jpg' },
  Leather: { image: '/images/leather.jpg' },
  Linen: { image: '/images/linen.jpg' },
  Nylon: { image: '/images/nylon.jpg' },
  Polyester: { image: '/images/polyester.jpg' },
  Rayon: { image: '/images/rayon.jpg' },
  Silk: { image: '/images/silk.jpg' },
  Wool: { image: '/images/wool.jpg' },
};


export const clothTypes = Object.keys(navigationData);

export async function fetchMaterials(clothType) {
  if (!clothType) return [];

  try {
    const response = await fetch(
      `${baseUrl}materials?type=${encodeURIComponent(clothType)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch materials for ${clothType}`);
    }

    const data = await response.json();

    const fetchedMaterials = Array.isArray(data) ? data : (data?.materials || []);
    const filteredMaterials = fetchedMaterials.filter(
      (mat) => mat.type && mat.type.toLowerCase() === clothType.toLowerCase()
    );

    return filteredMaterials;
  } catch (error) {
    throw error; 
  }
}
