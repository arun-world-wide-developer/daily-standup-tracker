import React, { useEffect, useState } from 'react'

const App = () => {
  const [name, setName] = useState('')
  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blockers, setBlockers] = useState('')
  const [standups, setStandups] = useState([])

  useEffect(() => {
    fetchStandups()
  }, [])

  const fetchStandups = async () => {
    const res = await fetch('http://localhost:8000/standups')
    const data = await res.json()
    setStandups(data)
  }

  const submitStandup = async () => {
    await fetch('http://localhost:8000/standup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, yesterday, today, blockers })
    })
    setName(''); setYesterday(''); setToday(''); setBlockers('')
    fetchStandups()
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Daily Standup Tracker</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Yesterday" value={yesterday} onChange={e => setYesterday(e.target.value)} />
        <input placeholder="Today" value={today} onChange={e => setToday(e.target.value)} />
        <input placeholder="Blockers" value={blockers} onChange={e => setBlockers(e.target.value)} />
        <button onClick={submitStandup}>Submit</button>
      </div>
      <h2>Team Updates</h2>
      <ul>
        {standups.map(s => (
          <li key={s.id}><b>{s.name}</b>: Yesterday - {s.yesterday}, Today - {s.today}, Blockers - {s.blockers}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
