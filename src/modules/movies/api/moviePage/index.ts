export const getMovieById = async (movieId: number, signal?: AbortSignal) => {
  const response = await fetch(`/api/movies/${movieId}`, { signal })

  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`)
  }

  const rawData = await response.json()

  return {
    ...rawData,
    director:
      rawData.credits?.crew?.find((member) => member.job === 'Director')?.name || 'Неизвестно',
  }
}
