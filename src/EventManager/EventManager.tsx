import { useCallback, useEffect, useState } from 'react'
import './eventManager.css'

import { GoogleSheetConfig } from '../google.ts'
import useFetchHolviTickets, { HolviTicket } from '../hooks/useFetchHolviTickets.ts'
import useLocalStorage from '../hooks/useLocalStorage.ts'
import TicketList from './TicketList.tsx'
import Scanner from './Scanner.tsx'
import useMarkHolviTicketCompleted from '../hooks/useMarkHolviTicketCompleted.ts'

const useCredentials = () => {
  const [credentials] = useLocalStorage<{ accessToken: string, tokenType: string, email: string }>('credentialResponse')

  if(!credentials) {
    throw new Error('User is not authenticated!')
  }
  return credentials
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
      range
    })
  }, [spreadsheetId, range, credentials])

  const {
    // isLoading,
    error,
    tickets
  } = useFetchHolviTickets(config)

  const {
    isLoading: isLoadingMarkCompleted,
    error: errorMarkCompleted,
    action,
    result
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

  }, [tickets])


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

  const isUpdateSuccess = result?.updatedRows != null || (ticket && ticket.isHandled === 'TRUE')

  return (
    <div>
      <h2>Event Manager</h2>
      {error ? <p className='error'>{error}</p> : null}
      <div id='event-manager'>
        <main>
          <Scanner
            onScanned={handleOnScanned}
            isScanned={!!ticket}
          />
          <div className='ticket-details'>
            {errorMarkCompleted
              ? <div className='error'>{errorMarkCompleted}</div>
              : null}

            {ticket && (
              <div>
                <h3>Ticket details</h3>
                <p><b>{ticket.firstName || '-'} {ticket.lastName || '-'}</b> {ticket.email || '-'}</p>
                <span>
                  {(ticket.isHandled == 'FALSE' && isUpdateSuccess)
                    ? <span className='alert alert__error'>Unused</span>
                    : <>
                      <b className='alert alert__success'>Used</b> {ticket.handledBy}
                      <div>
                        <small>{ticket.handledAt}</small>
                      </div>
                    </>
                  }
                </span>
                {!isUpdateSuccess
                  ? (
                    <button onClick={markHolviTickedCompleted}>
                      {isLoadingMarkCompleted
                        ? 'Loading...'
                        : 'Mark as completed'}
                    </button>
                  )
                  : null}
              </div>
            )}
          </div>
        </main>
        <aside>
          <TicketList tickets={tickets || []} />
        </aside>
      </div>
    </div>
  )
}
