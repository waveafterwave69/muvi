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
