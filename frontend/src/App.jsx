import React, { useEffect, useState } from 'react'

const App = () => {
  const [name, setName] = useState('')
  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blockers, setBlockers] = useState('')
  const [standups, setStandups] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStandups()
  }, [])

  const fetchStandups = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8000/standups')
      if (!res.ok) throw new Error('Failed to fetch standups')
      const data = await res.json()
      setStandups(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitStandup = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:8000/standup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, yesterday, today, blockers })
      })
      if (!res.ok) throw new Error('Failed to submit standup')
      setName('')
      setYesterday('')
      setToday('')
      setBlockers('')
      fetchStandups()
    } catch (err) {
      setError(err.message)
    }
  }

  const isFormValid = name && yesterday && today && blockers

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Daily Standup Tracker</h1>
      <form onSubmit={submitStandup} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          aria-label="Name"
        />
        <input
          placeholder="Yesterday"
          value={yesterday}
          onChange={e => setYesterday(e.target.value)}
          aria-label="Yesterday"
        />
        <input
          placeholder="Today"
          value={today}
          onChange={e => setToday(e.target.value)}
          aria-label="Today"
        />
        <input
          placeholder="Blockers"
          value={blockers}
          onChange={e => setBlockers(e.target.value)}
          aria-label="Blockers"
        />
        <button type="submit" disabled={!isFormValid || loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <section>
        <h2>Team Updates</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {standups.map(s => (
              <li key={s.id}>
                <strong>{s.name}</strong>: Yesterday - {s.yesterday}, Today - {s.today}, Blockers - {s.blockers}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App