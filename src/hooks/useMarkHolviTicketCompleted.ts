import { useCallback, useState } from 'react'
import { GoogleSheetConfig, isValidConfig, updateSheet, UpdateSheetResult } from '../google'
import { tryCatch } from '../helpers'


const markHolviTickedCompleted = async (
  data: string[],
  config: GoogleSheetConfig,
  onStart: () => void,
  onSuccess: (data: UpdateSheetResult) => void,
  onError: (error: string) => void
) => {
  onStart()
  const [googleError, response] = await tryCatch(updateSheet(config, data))
  if(googleError) {
    console.error(googleError)
    onError(googleError.message)
    return
  }
  onSuccess(response)
}


const useMarkHolviTicketCompleted = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<UpdateSheetResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setIsLoading(false)
    setResult(null)
    setError(null)
  }, [])

  const action = useCallback((config: GoogleSheetConfig | null) => {
    if(!isValidConfig(config)) {
      alert('Invalid config or row number')
      return
    }
    const data = [
      'TRUE',
      config.email,
      new Date().toISOString(),
    ]

    markHolviTickedCompleted(
      data,
      config,
      () => setIsLoading(true),
      (data) => {
        setResult(data)
        setIsLoading(false)
      },
      (error) => {
        setError(error)
        setIsLoading(false)
      })

  }, [])
  return {
    isLoading,
    error,
    action,
    result,
    reset
  }
}


export default useMarkHolviTicketCompleted
