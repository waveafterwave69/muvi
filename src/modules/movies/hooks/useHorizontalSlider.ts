'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export const useHorizontalSlider = (itemCount: number) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateControls = useCallback(() => {
    const list = listRef.current

    if (!list) return

    const maxScrollLeft = list.scrollWidth - list.clientWidth
    setCanScrollBack(list.scrollLeft > 1)
    setCanScrollForward(list.scrollLeft < maxScrollLeft - 1)
  }, [])

  useEffect(() => {
    const list = listRef.current

    if (!list) return

    updateControls()
    list.addEventListener('scroll', updateControls, { passive: true })

    const resizeObserver = new ResizeObserver(updateControls)
    resizeObserver.observe(list)

    return () => {
      list.removeEventListener('scroll', updateControls)
      resizeObserver.disconnect()
    }
  }, [itemCount, updateControls])

  const scroll = (direction: -1 | 1) => {
    const list = listRef.current
    const firstItem = list?.firstElementChild as HTMLElement | null

    if (!list || !firstItem) return

    const gap = Number.parseFloat(window.getComputedStyle(list).columnGap) || 0
    const step = firstItem.offsetWidth + gap
    const visibleItems = Math.max(1, Math.round(list.clientWidth / step))

    list.scrollBy({ left: direction * step * visibleItems, behavior: 'smooth' })
  }

  return {
    listRef,
    canScrollBack,
    canScrollForward,
    scroll,
  }
}
