'use client'

import styles from './ResetPasswordForm.module.scss'
import { Button, Card, Input, Link } from '@/shared/ui'
import { Check, Lock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../../hooks/useAuth'
import { useState } from 'react'

type FormValues = {
  password: string
  confirmPassword: string
}

export const ResetPasswordForm = () => {
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
  } = useForm<FormValues>()
  const { updatePassword } = useAuth()

  const onSubmit = async (formData: FormValues) => {
    if (formData.password !== formData.confirmPassword) return

    const { error } = await updatePassword(formData.password)

    if (error?.message) {
      setError(error.message)
    } else {
      setIsSuccess(true)
    }
  }

  return (
    <Card>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.header}>
          <h3>Новый пароль</h3>
          <p>Введи новый пароль и повтори его, чтобы подтвердить изменение.</p>
        </div>
        <Input
          icon={<Lock />}
          label="Новый пароль"
          placeholder="Минимум 8 символов"
          type="password"
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
        <Input
          icon={<Lock />}
          label="Подтверждение пароля"
          placeholder="Повтори новый пароль"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Повторите пароль',
            minLength: {
              value: 8,
              message: 'Пароль должен содержать минимум 8 символов',
            },
            validate: (value) => value === getValues('password') || 'Пароли не совпадают',
          })}
        />
        {isSuccess && (
          <div className={styles.alert}>
            <div className={styles.icon}>
              <Lock />
            </div>
            <p aria-live="polite">Пароль успешно изменен.</p>
            <Link href={'/'}>На главную</Link>
          </div>
        )}
        {!isSuccess && (
          <Button rightIcon={<Check />} type="submit" className={styles.submit_button}>
            {isSubmitting ? 'Сохраняем...' : 'Сохранить пароль'}
          </Button>
        )}
        {error && <span className={styles.error}>{error}</span>}
      </form>
    </Card>
  )
}
