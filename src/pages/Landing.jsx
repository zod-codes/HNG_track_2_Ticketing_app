import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Landing() {
    return (
        <div className="app">
            <Header />
            <main>
                <section className="hero">
                    <div className="circle-decoration circle-1" aria-hidden></div>
                    <div className="circle-decoration circle-2" aria-hidden></div>
                    <div className="container">
                        <h1>Manage Your Tickets with Ease</h1>
                        <p>The complete solution for tracking, organizing, and resolving support tickets efficiently.</p>
                        <div className="hero-buttons">
                            <a href="/auth/signup" className="btn btn-primary">Get Started</a>
                            <a href="/auth/login" className="btn btn-secondary">Login</a>
                        </div>
                    </div>
                </section>

                <section className="features">
                    <div className="container">
                        <h2 className="section-title">Powerful Features</h2>
                        <p className="section-subtitle">Everything you need to manage tickets effectively</p>
                        <div className="feature-grid">
                            <div className="feature-card"><div className="feature-icon">🎫</div><h3>Easy Ticket Creation</h3><p>Create and organize tickets in seconds.</p></div>
                            <div className="feature-card"><div className="feature-icon">📊</div><h3>Real-time Dashboard</h3><p>Monitor ticket status with live statistics.</p></div>
                            <div className="feature-card"><div className="feature-icon">⚡</div><h3>Quick Actions</h3><p>Update or close tickets with a few clicks.</p></div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}