import { SignUpForm } from '../../components'
import SideContent from '../../components/SideContent/SideContent'
import styles from './SignupPage.module.scss'

export const SignupPage = () => {
  return (
    <div className={styles.root}>
      <SideContent variant={'signup'} />
      <div className={styles.form}>
        <SignUpForm />
      </div>
    </div>
  )
}
