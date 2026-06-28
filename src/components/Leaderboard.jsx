import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const Leaderboard = ({ onBack, user }) => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'playerStats'), orderBy('highScore', 'desc'), limit(10))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPlayers(items)
      setLoading(false)
    }, (err) => {
      console.error('Leaderboard snapshot error', err)
      setError('Unable to load leaderboard.')
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="leaderboard-page">
      <button className="auth-button profile-back" onClick={onBack}>Back</button>
      <h2>Top 10 High Scores</h2>
      <p className="leaderboard-note">Updated live when players earn a new high score.</p>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>High Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={player.id} className={user && user.uid === player.id ? 'leaderboard-row-highlight' : ''}>
                <td>{index + 1}</td>
                <td>{player.displayName || player.id}</td>
                <td>{player.highScore || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Leaderboard
