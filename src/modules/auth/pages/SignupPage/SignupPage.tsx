import styles from './SignupPage.module.scss';
import { Heart } from 'lucide-react';
import { SignUpForm } from '../../components';

export function SignupPage() {
    return (
        <div className={styles.root}>
            <section className={styles.intro}>
                <div className={styles.badge}>
                    <Heart aria-hidden="true" />
                    <span>MUVI · personal cinema</span>
                </div>

                <h1 className={styles.title}>
                    Собери свой уютный киновечер
                </h1>

                <p className={styles.description}>
                    Создавай списки фильмов, отмечай просмотренное и выбирай,
                    что посмотреть одному или вместе.
                </p>
            </section>

            <div className={styles.form}>
                <SignUpForm />
            </div>
        </div>
    )
}
