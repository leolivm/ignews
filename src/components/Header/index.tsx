import styles from './styles.module.scss'
import { SignInButton } from '../SignInButton'
import { ActiveLink } from '../ActiveLink'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeLinkClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink
            activeLinkClassName={styles.active}
            href="/posts"
            prefetch
          >
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
