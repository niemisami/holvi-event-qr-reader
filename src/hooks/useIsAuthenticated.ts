import { googleLogout, TokenResponse, useGoogleLogin } from '@react-oauth/google'
import { useCallback, useState } from 'react'

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email'

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const credentials = localStorage.getItem('credentialResponse')
    return !!credentials
  })
  const setCredentials = useCallback((credentialResponse: TokenResponse) => {
    if(credentialResponse.access_token == null) {
      throw new Error('No access token')
    }
    localStorage.setItem('credentialResponse', JSON.stringify({
      ...credentialResponse,
      accessToken: credentialResponse.access_token,
      tokenType: credentialResponse.token_type,
      email: 'TODO: get email somehow'
    }))
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('credentialResponse')
    googleLogout()
    setIsAuthenticated(false)
  }, [])

  const login = useGoogleLogin({
    onSuccess: setCredentials,
    scope: SCOPE,
  });

  // useGoogleOneTapLogin({
  //   onSuccess: creds => {
  //     console.log(creds)
  //   }
  // });

  return { isAuthenticated, setCredentials, login, logout }
}

export default useIsAuthenticated
