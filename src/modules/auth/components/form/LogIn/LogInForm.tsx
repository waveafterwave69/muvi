'use client'

import styles from './LogInForm.module.scss'
import { Button, Card, Input, Link } from '@/shared/ui'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { AuthError } from '@supabase/auth-js'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/modules/auth/hooks/useAuth'

interface FormValues {
  username: string
  email: string
  password: string
}

export const LogInForm = () => {
  const [error, setError] = useState<AuthError | null>(null)
  const { handleLogin } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onBlur',
  })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError(null)
    const { error } = await handleLogin(data.email, data.password)

    if (error) {
      setError(error)
      return
    }

    router.push('profile')
  }

  return (
    <Card>
      <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.title}>
          <h3>Вход</h3>
          <p>Заполни данные, чтобы войти в свой аккаунт.</p>
        </div>
        <Input
          label="Почта"
          placeholder="name@example.com"
          icon={<Mail />}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Введите почту',
            setValueAs: (value: string) => value.trim(),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Введите корректный адрес почты',
            },
          })}
        />
        <div className={styles.password_container}>
          <Link href={'/forgot-password'}>Забыли пароль?</Link>
          <Input
            label="Пароль"
            placeholder="Минимум 8 символов"
            type="password"
            icon={<Lock />}
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Введите пароль',
              minLength: {
                value: 8,
                message: 'Пароль должен содержать минимум 8 символов',
              },
              validate: {
                uppercase: (value) =>
                  value !== value.toLocaleLowerCase() || 'Добавьте хотя бы одну заглавную букву',
                specialCharacter: (value) =>
                  /[^\p{L}\p{N}\s]/u.test(value) || 'Добавьте хотя бы один специальный символ',
              },
            })}
          />
        </div>
        <Button
          leftIcon={<ArrowRight />}
          className={styles.submit_button}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
        {error && <span>{error.message}</span>}
        <div className={styles.footer}>
          <span>Нет аккаунта?</span>
          <Link href="/signup">Регистрация</Link>
        </div>
      </form>
    </Card>
  )
}
