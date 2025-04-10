import { useState } from 'react'

const useLocalStorage = <T,>(key: string, defaultValues?: T) => {
  type TState = T extends undefined ? undefined : T

  const [storedValue, setStoredValue] = useState<TState>(() => {
    try {
      const item = localStorage.getItem(key)
      return (item ? JSON.parse(item) : defaultValues) as TState
    } catch(error) {
      console.error(error)
      return defaultValues as TState
    }
  })

  const setValue = (value: TState | ((val: TState) => TState)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch(error) {
      console.error(error)
    }
  }
  return [storedValue, setValue] as const
}

export default useLocalStorage
