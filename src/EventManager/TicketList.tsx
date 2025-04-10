import { HolviTicket } from '../hooks/useFetchHolviTickets'

type Props = {
  tickets: HolviTicket[]
}

const TicketList = ({ tickets }: Props) => {
  return (
    <>
      <h3>Tickets</h3>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.ticketId}>
            <div>
              <b>{ticket.firstName || '-'} {ticket.lastName || '-'}</b> {ticket.email || '-'}
              <span style={{ padding: '0.5rem' }}>
                {ticket.isHandled == 'FALSE'
                  ? <span className='alert alert__error'>'Unhandled</span>
                  : <>
                    <b className='alert alert__success'>Handled</b>{ticket.handledBy} - <small>{ticket.handledAt}</small>
                  </>
                }
              </span>
            </div>
          </li>
        ))}
      </ul>
    </ >
  )
}

export default TicketList
