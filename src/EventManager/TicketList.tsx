import { HolviTicket } from '../hooks/useFetchHolviTickets'

import './ticketList.css'
type Props = {
  tickets: HolviTicket[]
  refetch: () => void
  handledTickets: Set<string>
}

const TicketList = ({ tickets, refetch, handledTickets }: Props) => {
  return (
    <div id='ticket-list'>
      <div>
        <h3>Tickets</h3>
        <button onClick={refetch}>🔄 Refresh list</button>
      </div>
      <ol>
        {tickets.map((ticket) => (
          <li key={ticket.ticketId}>
            <div className='list-ticket'>
              <div>
                <b>{ticket.firstName || '-'} {ticket.lastName || '-'}</b>
                <div>{ticket.email || '-'}</div>
                <i className='text-muted'>{ticket.handledBy} - <small>{ticket.handledAt}</small></i>
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
          </li>
        ))}
      </ol >
    </div >
  )
}

export default TicketList
