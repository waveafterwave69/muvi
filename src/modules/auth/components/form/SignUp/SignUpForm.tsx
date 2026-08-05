'use client'

import styles from './SignUpForm.module.scss'
import { Button, Card, Input, Link } from '@/shared/ui'
import { ArrowRight, Lock, Mail, User } from 'lucide-react'
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

export const SignUpForm = () => {
  const [error, setError] = useState<AuthError | null>(null)
  const { handleSignUp } = useAuth()
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
    const { error } = await handleSignUp(data.username, data.email, data.password)

    if (!!error) {
      setError(error)
      return
    }

    router.push('/profile')
  }

  return (
    <Card>
      <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.title}>
          <h3>Регистрация</h3>
          <p>Заполни данные, чтобы сохранить фильмы и общие планы.</p>
        </div>
        <Input
          label="Имя пользователя"
          placeholder="Например, luna.movie"
          icon={<User />}
          autoComplete="username"
          error={errors.username?.message}
          {...register('username', {
            required: 'Введите имя пользователя',
            setValueAs: (value: string) => value.trim(),
            validate: (value) =>
              value.length >= 2 || 'Имя пользователя должно содержать минимум 2 символа',
          })}
        />
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
        <Button
          leftIcon={<ArrowRight />}
          className={styles.submit_button}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация…' : 'Зарегистрироваться'}
        </Button>
        {error && <span>{error.message}</span>}
        <div className={styles.footer}>
          <span>Уже есть аккаунт?</span>
          <Link href="/login">Вход</Link>
        </div>
      </form>
    </Card>
  )
}
