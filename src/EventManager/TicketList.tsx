import { HolviTicket } from '../hooks/useFetchHolviTickets'

import './ticketList.css'
type Props = {
  tickets: HolviTicket[]
}

const TicketList = ({ tickets }: Props) => {
  return (
    <div id='ticket-list'>
      <h3>Tickets</h3>
      <ol>
        {tickets.map((ticket) => (
          <li key={ticket.ticketId}>
            <div className='list-ticket'>
              <div>
                <b>{ticket.firstName || '-'} {ticket.lastName || '-'}</b>
                <div>{ticket.email || '-'}</div>
              </div>
              <span className='list-status'>
                {ticket.isHandled == 'FALSE'
                  ? <span className='alert alert__error'>Unhandled</span>
                  : <>
                    <b className='alert alert__success'>Handled</b>{ticket.handledBy} - <small>{ticket.handledAt}</small>
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
