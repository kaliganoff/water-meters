export async function fetchMeters(offset = 0) {
  const result = await fetch(`/api/meters/?limit=20&offset=${offset}`);

  if (!result.ok) {
    throw new Error('Unable to load meters');
  }

  return result.json();
}
