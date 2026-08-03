import { ProfileContent } from '@/modules/profile'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ProfilePage',
}

const ProfilePage = () => {
    return (
        <>
            <ProfileContent />
        </>
    )
}

export default ProfilePage
