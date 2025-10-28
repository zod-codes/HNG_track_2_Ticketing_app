import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useTickets } from '../hooks/useTickets'

export default function Dashboard() {
  const { tickets } = useTickets()
  const total = tickets.length
  const open = tickets.filter(t => t.status === 'open').length
  const inProgress = tickets.filter(t => t.status === 'in_progress').length
  const closed = tickets.filter(t => t.status === 'closed').length

  return (
    <div className="app">
      <Header />
      <main className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Dashboard</h1>
            <Link to="/tickets" className="btn btn-primary">Manage Tickets</Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Total Tickets</div><div className="stat-value">{total}</div></div>
            <div className="stat-card open"><div className="stat-label">Open Tickets</div><div className="stat-value">{open}</div></div>
            <div className="stat-card in-progress"><div className="stat-label">In Progress</div><div className="stat-value">{inProgress}</div></div>
            <div className="stat-card closed"><div className="stat-label">Closed Tickets</div><div className="stat-value">{closed}</div></div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}