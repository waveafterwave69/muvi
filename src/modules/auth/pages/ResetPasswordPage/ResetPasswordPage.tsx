import styles from './ResetPasswordPage.module.scss'
import SideContent from '../../components/SideContent/SideContent'
import { ResetPasswordForm } from '../../components/form/ResetPasswordForm/ResetPasswordForm'

export const ResetPasswordPage = () => {
  return (
    <div className={styles.root}>
      <SideContent variant={'resetPassword'} />
      <div className={styles.form}>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
