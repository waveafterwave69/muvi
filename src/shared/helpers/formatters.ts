export const formatDate = (isoString: string): string => {
  if (!isoString) return ''

  const date = new Date(isoString)

  if (isNaN(date.getTime())) {
    return 'Некорректная дата'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export const formatRuntime = (runtime: number): string => {
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60

  if (!hours) return `${minutes} м.`
  if (!minutes) return `${hours} ч.`

  return `${hours} ч. ${minutes} м.`
}
