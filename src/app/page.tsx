'use client'

import { useState } from 'react'
import { Tab } from '@/shared/types/tab'
import { Tabs } from '@/shared'

const mainTabs: Tab[] = [
    { label: 'Все', id: 1 },
    { label: 'Фильмы', id: 2 },
    { label: 'Сериалы', id: 3 },
]

const subTabs: Tab[] = [
    { label: 'Избранные', id: 1 },
    { label: 'Просмотренные', id: 2 },
]

const Home = () => {
    const [activeMainTab, setActiveMainTab] = useState<number>(1)
    const [activeSubTab, setActiveSubTab] = useState<number>(2)

    return (
        <>
            <Tabs
                variant="primary"
                tabs={mainTabs}
                value={activeMainTab}
                onChange={setActiveMainTab}
                size="md"
            />

            <Tabs
                variant="secondary"
                tabs={subTabs}
                value={activeSubTab}
                onChange={setActiveSubTab}
                size="sm"
            />
        </>
    )
}

export default Home
