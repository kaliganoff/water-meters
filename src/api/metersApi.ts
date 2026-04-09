export async function fetchMeters(offset = 0) {
  const result = await fetch(`/api/meters/?limit=20&offset=${offset}`);

  if (!result.ok) {
    throw new Error('Unable to load meters');
  }

  return result.json();
}

export async function deleteMeter(id: string) {
  const result = await fetch(`/api/meters/${id}/`, {
    method: 'DELETE',
  });

  if (!result.ok) {
    throw new Error('Failed to delete');
  }
}
