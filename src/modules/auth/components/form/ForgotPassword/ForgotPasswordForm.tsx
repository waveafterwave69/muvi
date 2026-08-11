'use client'

import styles from './ForgotPasswordForm.module.scss'
import { Button, Card, Input, Link } from '@/shared/ui'
import { Mail, MailCheck, Send } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'

interface FormValues {
  email: string
}

export const ForgotPasswordForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [sentEmail, setSentEmail] = useState<string | null>(null)

  const { forgotPassword } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setError(null)
    setSentEmail(null)

    const error = await forgotPassword(values.email)

    if (error?.message) {
      setError(error.message)
      return
    }

    setSentEmail(values.email)
  }

  return (
    <Card>
      <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.header}>
          <h3>Восстановление пароля</h3>
          <p>Введи почту, привязанную к аккаунту MUVI.</p>
        </div>
        <Input
          icon={<Mail />}
          label="Почта"
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register('email', {
            required: 'Введите почту',
            setValueAs: (value: string) => value.trim(),
            onChange: () => {
              setError(null)
              setSentEmail(null)
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Введите корректный адрес почты',
            },
          })}
        />
        <div className={styles.alert}>
          <div className={styles.icon}>
            <MailCheck />
          </div>
          <p aria-live="polite">
            {sentEmail
              ? `Ссылка отправлена на ${sentEmail}. Проверь почту.`
              : 'Проверь почту: мы отправим туда ссылку для сброса пароля.'}
          </p>
        </div>
        {!sentEmail && (
          <Button
            rightIcon={<Send />}
            type="submit"
            className={styles.submit_button}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Отправляем...' : 'Отправить ссылку'}
          </Button>
        )}
        {error && <span role="alert">{error}</span>}
        <div className={styles.footer}>
          <span>Вспомнил пароль?</span>
          <Link href={'/login'}>Вернуться ко входу</Link>
        </div>
      </form>
    </Card>
  )
}
