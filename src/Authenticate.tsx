import { ReactNode } from 'react'
import Header from './Header'
import useIsAuthenticated from './hooks/useIsAuthenticated'

type Props = { children: ReactNode }



const Authenticate = ({ children }: Props) => {
  const { isAuthenticated, login, logout } = useIsAuthenticated()

  return isAuthenticated
    ? (
      <>
        <Header onLogout={logout} />
        <section id='main'>
          {children}
        </section>
      </>
    )
    : (
      <>
        <Header />
        <section id='main'>
          <p><strong>App for managing Holvi event tickets.</strong></p>
          <p>Start by loggin in with Google</p>
          <button
            onClick={() => login()}
          >
            🔑 Log In
          </button>
        </section>
      </>
    )
}

export default Authenticate
