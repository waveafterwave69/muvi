
export const getDaysLeft = (expiresAt: string) => {
  const remaining = new Date(expiresAt).getTime() - Date.now()
  const days = Math.max(0, Math.ceil(remaining / 86_400_000))
  const rule = new Intl.PluralRules('ru-RU').select(days)
  const labels: Record<Intl.LDMLPluralRule, string> = {
    zero: 'дней',
    one: 'день',
    two: 'дня',
    few: 'дня',
    many: 'дней',
    other: 'дня',
  }

  return days === 0 ? 'Истекает сегодня' : `${days} ${labels[rule]}`
}
