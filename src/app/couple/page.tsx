import type { Metadata } from 'next'
import { CouplePage } from '@/modules/couple'

export const metadata: Metadata = {
  title: 'Пара',
  description: 'Создайте пару в MUVI и выбирайте фильмы для совместного просмотра.',
}

export default function Page() {
  return <CouplePage />
}
