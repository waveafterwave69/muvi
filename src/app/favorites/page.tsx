import { FavoritesPage } from '@/modules/media'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Избранные',
  description:
    'Смотрите и управляйте вашими избранными фильмамы и сериалами на вашем аккаунте MUVI.',
}

export default function Page() {
  return <FavoritesPage />
}
