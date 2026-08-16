import { MoviesPage } from '@/modules/movies'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Фильмы',
  description: 'Исследуйте каталог фильмов, находите интересные картины и добавляйте их в свои списки.',
}

export default function Page() {
  return <MoviesPage />
}
