export async function fetchAreas(ids: string[]) {
  const query = ids.join('&id__in=');
  const result = await fetch(`/api/areas/?id__in=${query}`);

  if (!result.ok) {
    throw new Error('Unable to load areas');
  }

  return result.json();
}
