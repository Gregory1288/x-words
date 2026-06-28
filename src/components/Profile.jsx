import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const Profile = ({ user, onBack }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    async function fetchStats() {
      setLoading(true);
      setError(null);

      try {
        const statsRef = doc(db, 'playerStats', user.uid);
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
          setStats(statsSnap.data());
        } else {
          setStats({
            totalGamesPlayed: 0,
            totalGamesWon: 0,
            averageScore: 0,
            totalScore: 0,
            highScore: 0,
          });
        }
      } catch (fetchError) {
        setError('Failed to load profile statistics.');
        console.error(fetchError);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user])

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Profile</h2>
        <p>Please sign in to view your stats.</p>
        <button className="auth-button" onClick={onBack}>Back</button>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <button className="auth-button profile-back" onClick={onBack}>Back</button>
      <h2>{user.displayName || user.email}'s Stats</h2>

      {loading ? (
        <p>Loading statistics...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total games played</h3>
            <p>{stats.totalGamesPlayed}</p>
          </div>
          <div className="stat-card">
            <h3>Total games won</h3>
            <p>{stats.totalGamesWon}</p>
          </div>
          <div className="stat-card">
            <h3>Average score</h3>
            <p>{stats.averageScore.toFixed(1)}</p>
          </div>
          <div className="stat-card">
            <h3>High score</h3>
            <p>{stats.highScore}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
