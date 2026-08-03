import { HomeContent } from '@/modules/home'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
}

const Home = () => {
  return (
    <>
      <HomeContent />
    </>
  )
}

export default Home
