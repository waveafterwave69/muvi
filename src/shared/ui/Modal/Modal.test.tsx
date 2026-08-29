import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

describe('Modal', () => {
  it('не отображается, когда isOpen=false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Контент
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('isOpen=true отображает модалку и контент', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        Контент внутри модалки
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Контент внутри модалки')).toBeInTheDocument()
  })

  it('вызывается onClose при клике на кнопку закрытия', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal isOpen onClose={onClose}>
        Контент
      </Modal>,
    )

    const closeButton = screen.getByRole('button', {
      name: 'Закрыть модальное окно',
    })

    await user.click(closeButton)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('escape вызывает закрытие модалки', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal isOpen onClose={onClose}>
        Контент
      </Modal>,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('закрытие при клике по оверлею', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal isOpen onClose={onClose}>
        Контент
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    const overlay = dialog.parentElement

    expect(overlay).not.toBeNull()

    await user.click(overlay!)

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('модалка не закрывается если клинкуть именно по ней', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal isOpen onClose={onClose}>
        Контент
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    const content = screen.getByText('Контент')

    await user.click(dialog)
    await user.click(content)

    expect(onClose).not.toHaveBeenCalled()
  })

  it('восстановиление прокрутки после размонтирования', () => {
    const previousOverflow = document.body.style.overflow
    const onClose = vi.fn()

    const { unmount } = render(
      <Modal isOpen onClose={onClose}>
        Контент
      </Modal>,
    )

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe(previousOverflow)
  })
})
