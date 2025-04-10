import { useEffect, useState } from 'react'
import { getSheetRows, GoogleSheetConfig, isValidConfig, missingConfigKeys } from '../google'
import { tryCatch } from '../helpers'

export type HolviTicket = {
  orderNumber: string | null,
  receiptNumber: string | null,
  ticketId: string | null,
  price: string | null,
  discountCode: string | null,
  lastName: string | null,
  firstName: string | null,
  company: string | null,
  email: string | null,
  phoneNumber: string | null,
  address: string | null,
  postalCode: string | null,
  city: string | null,
  county: string | null,
  createdAt: string | null,
  isHandled: string | null,
  handledBy: string | null,
  handledAt: string | null,
}

/**
 * `extraFields` are added to the sheet by the app
 */
const holviSheetData: { field: keyof HolviTicket, header: string, extraField?: boolean }[] = [
  { field: 'orderNumber', header: 'Tilaus' },
  { field: 'receiptNumber', header: 'Kuitin numero' },
  { field: 'ticketId', header: 'Tilauskoodi' },
  { field: 'price', header: 'Hinta, EUR' },
  { field: 'discountCode', header: 'Alennuskoodi' },
  { field: 'lastName', header: 'Sukunimi' },
  { field: 'firstName', header: 'Etunimi' },
  { field: 'company', header: 'Yritys' },
  { field: 'email', header: 'Sähköposti' },
  { field: 'phoneNumber', header: 'Puhelinnumero' },
  { field: 'address', header: 'Katuosoite' },
  { field: 'postalCode', header: 'Postinumero' },
  { field: 'city', header: 'Kaupunki' },
  { field: 'county', header: 'Maa' },
  { field: 'createdAt', header: 'Päiväys' },
  { field: 'isHandled', header: 'Käsitelty' },
  { field: 'handledBy', header: 'Käsittelijä', extraField: true },
  { field: 'handledAt', header: 'Käsittelyaika', extraField: true },
]

const parseSheetsResponse = (sheetRows: string[][]): HolviTicket[] => {
  const [headerRow, ...rows] = sheetRows
  if(!headerRow || rows.length === 0) {
    throw new Error('Sheet didn\t contain any data')
  }
  const missingHeaders: typeof holviSheetData = []
  const fieldIndices = holviSheetData.map((sheetField) => {
    const index = headerRow.indexOf(sheetField.header)
    if(index === -1) {
      missingHeaders.push(sheetField)
    }
    return { field: sheetField.header, index }
  })

  if(missingHeaders.length > 0) {
    const errorMessages = missingHeaders.map(({ header, extraField }) => {
      if(extraField) {
        return `Missing header: ${header}. This header must be added manually`
      }
      return `Missing header: ${header}`
    })
    throw new Error(errorMessages.join('\n'))
  }

  return rows.map(row => {
    return fieldIndices.reduce((acc, { field, index }) => {
      return {
        ...acc,
        [field]: row[index] || null
      }
    }, {} as HolviTicket)
  })
}

const fetchHolviTickets = async (
  config: GoogleSheetConfig,
  onStart: () => void,
  onSuccess: (data: HolviTicket[]) => void,
  onError: (error: string) => void
) => {

  onStart()
  const [googleError, sheetData] = await tryCatch(getSheetRows(config))
  if(googleError) {
    console.error(googleError)
    onError(googleError.message)
    return
  }
  const [parseError, parsedData] = await tryCatch(() => parseSheetsResponse(sheetData))
  if(parseError) {
    console.error(parseError)
    onError(parseError.message)
    return
  }
  onSuccess(parsedData)
}


export const useFetchHolviTickets = (config: GoogleSheetConfig | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [tickets, setTickets] = useState<HolviTicket[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(config == null) {
      return
    }

    if(!isValidConfig(config)) {
      const missingKeys = missingConfigKeys(config)
      setIsLoading(false)
      setError(`Invalid config. Missing field: ${missingKeys.join(', ')}`)
      return
    }

    fetchHolviTickets(
      config,
      () => setIsLoading(true),
      (data) => {
        setTickets(data)
        setIsLoading(false)
      },
      (error) => {
        setError(error)
        setIsLoading(false)
      })
  }, [config])
  return {
    isLoading,
    error,
    tickets
  }
}

export const useMarkHolviTicketCompleted = (config: GoogleSheetConfig | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [tickets, setTickets] = useState<HolviTicket[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(isValidConfig(config)) {
      fetchHolviTickets(
        config,
        () => setIsLoading(true),
        (data) => {
          setTickets(data)
          setIsLoading(false)
        },
        (error) => {
          setError(error)
          setIsLoading(false)
        })
    }
  }, [config])
  return {
    isLoading,
    error,
    tickets
  }
}

export default useFetchHolviTickets
