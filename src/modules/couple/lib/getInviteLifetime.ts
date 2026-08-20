export const getInviteLifetime = (expiresAt: string) => {
  const expiresAtTime = new Date(expiresAt).getTime()

  if (Number.isNaN(expiresAtTime)) return 'Срок действия указан в приглашении'

  const remainingDays = Math.max(0, Math.ceil((expiresAtTime - Date.now()) / 86_400_000))

  if (remainingDays === 0) return 'Приглашение истекает сегодня'

  const daysLabel = new Intl.PluralRules('ru-RU').select(remainingDays)
  const labels: Record<Intl.LDMLPluralRule, string> = {
    zero: 'дней',
    one: 'день',
    two: 'дня',
    few: 'дня',
    many: 'дней',
    other: 'дня',
  }

  return `Приглашение действительно ещё ${remainingDays} ${labels[daysLabel]}`
}
