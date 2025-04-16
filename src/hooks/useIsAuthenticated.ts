import { googleLogout, TokenResponse, useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useCallback, useState } from 'react'

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

const _isAuthenticated = () => {
  const credentials = localStorage.getItem('tokenResponse')
  const user = localStorage.getItem('user')

  console.log({
    credentials,
    user
  })

  return !!credentials && !!user
}

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => _isAuthenticated())

  const setCredentials = useCallback((tokenResponse: TokenResponse) => {
    if(tokenResponse.access_token == null) {
      throw new Error('No access token')
    }
    localStorage.setItem('tokenResponse', JSON.stringify({
      ...tokenResponse,
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type
    }))
    setIsAuthenticated(_isAuthenticated())
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('tokenResponse')
    googleLogout()
    setIsAuthenticated(false)
  }, [])

  const login = useGoogleLogin({
    onSuccess: setCredentials,
    scope: SCOPE
  });

  useGoogleOneTapLogin({
    auto_select: true,
    disabled: isAuthenticated,
    onSuccess: creds => {
      if(creds.credential) {
        const decoded = jwtDecode(creds.credential) as { email: string, name: string }
        localStorage.setItem('user', JSON.stringify(decoded))

        if(!_isAuthenticated()) {
          return login()
        }
        setIsAuthenticated(_isAuthenticated())
      }
    }
  });

  return { isAuthenticated, login, logout }
}

export default useIsAuthenticated
