import { useCallback, useEffect, useMemo, useState } from 'react'
import './eventManager.css'

import { GoogleSheetConfig } from '../google.ts'
import useFetchHolviTickets, { HolviTicket } from '../hooks/useFetchHolviTickets.ts'
import useLocalStorage from '../hooks/useLocalStorage.ts'
import TicketList from './TicketList.tsx'
import Scanner from './Scanner.tsx'
import useMarkHolviTicketCompleted from '../hooks/useMarkHolviTicketCompleted.ts'

const useCredentials = () => {
  const [credentials] = useLocalStorage<{ accessToken: string, tokenType: string }>('tokenResponse')
  const [user] = useLocalStorage<{ email: string, name: string }>('user')

  if(!credentials || !user) {
    throw new Error('User is not authenticated!')
  }
  return useMemo(() => ({
    ...credentials,
    ...user
  }), [credentials, user])
}

type Props = {
  spreadsheetId: string
  range: string
}

export const EventManager = ({ spreadsheetId, range }: Props) => {
  const [config, setConfig] = useState<GoogleSheetConfig | null>(null)
  const [ticket, setTicket] = useState<HolviTicket | null>(null)

  // Fetch latest tickets from Sheets
  const credentials = useCredentials()
  useEffect(() => {
    setConfig({
      ...credentials,
      spreadsheetId,
      range,
      email: credentials.email
    })
  }, [spreadsheetId, range, credentials])

  const {
    // isLoading,
    error,
    tickets,
    refetch: refetchTickets,
  } = useFetchHolviTickets(config)

  const [handledTickets, setHandledTicket] = useState(new Set<string>())

  const {
    isLoading: isLoadingMarkCompleted,
    error: errorMarkCompleted,
    action,
    result,
    reset
  } = useMarkHolviTicketCompleted()

  const handleOnScanned = useCallback((ticketId: string | null) => {
    if(!ticketId || !Array.isArray(tickets)) {
      setTicket(null)
      return
    }
    const ticket = tickets.find(ticket => ticket.ticketId === ticketId)
    if(!ticket) {
      alert(`Ticket ${ticketId} not found from Sheet`)
      return
    }
    setTicket(ticket)
    reset()

  }, [tickets, reset])


  const markHolviTickedCompleted = () => {
    if(ticket && Array.isArray(tickets)) {
      const ticketIndex = tickets.findIndex(holviTicket => holviTicket.ticketId === ticket.ticketId)
      if(ticketIndex === -1) {
        alert(`Ticket ${ticket.ticketId} not found from Sheet`)
        return
      }
      const rowNumber = ticketIndex + 2 // +2 because of header and 0-index
      // TODO: could be parsed from headers. Not today..
      const updateRange = `P${rowNumber}:R`
      action({
        ...credentials,
        spreadsheetId,
        range: updateRange
      })
    }
  }

  useEffect(() => {
    if(result?.updatedRows && ticket) {
      setHandledTicket(handledTickets => new Set(handledTickets.add(ticket.ticketId)))
      setTicket(null)
    }
  }, [result?.updatedRows, ticket])

  return (
    <div>
      {error ? <p className='error'>{error}</p> : null}
      <div id='event-manager'>
        <main>
          <Scanner
            onScanned={handleOnScanned}
            isScanned={!!ticket}
          />
        </main>
        <aside>
          <div>
            <div className='ticket-details__header'>
              {ticket
                ? (
                  <>
                    <h3>Ticket details</h3>
                    {handledTickets.has(ticket.ticketId)
                      ? null
                      : (
                        <button onClick={markHolviTickedCompleted} style={{ marginLeft: 'auto' }}>
                          {isLoadingMarkCompleted
                            ? 'Loading...'
                            : '✅ Mark as used'}
                        </button>
                      )}
                  </>
                )
                : null}
            </div>
            {errorMarkCompleted
              ? <div className='error'>{errorMarkCompleted}</div>
              : null}
            {ticket
              ? (
                <div className='ticket-details'>
                  <div>
                    <b>{ticket.firstName || '-'} {ticket.lastName || '-'}</b>
                    <div>{ticket.email || '-'}</div>
                    <div className='text-muted'>
                      <i>{ticket.handledBy}<br /> <small>{ticket.handledAt}</small></i>
                    </div>
                  </div>
                  <span className='list-status'>
                    {ticket.isHandled == 'FALSE' && !handledTickets.has(ticket.ticketId)
                      ? <span className='alert alert__error'>Unhandled</span>
                      : <>
                        <b className='alert alert__success'>Handled</b>
                      </>
                    }
                  </span>
                </div>
              )
              : (
                <>
                  <ol className='text-muted'>
                    <li>Start scanner</li>
                    <li>Scan QR-code</li>
                    <li>View ticket details here</li>
                  </ol>
                </>
              )}
          </div>
        </aside>
      </div>
      <TicketList tickets={tickets || []} refetch={refetchTickets} handledTickets={handledTickets} />
    </div>
  )
}
