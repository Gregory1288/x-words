import { useEffect, useState } from 'react'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth } from '../firebase'
// I just added the auth here cuz im lazy to change the name of the file to firebaseAuth.js or something. might change later

const Header = () => {
  const [user, setUser] = useState(null)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  async function handleSignIn() {
    setIsSigningIn(true)

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error(error)
      alert('Sign in failed. Please try again.')
    } finally {
      setIsSigningIn(false)
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error(error)
      alert('Unable to sign out right now.')
    }
  }

  return (
    <>
      <h1>X-Words</h1>
      <p>Welcome to X-Words! Can you guess the correct word?</p>

      {user ? (
        <div>
          <p>Signed in as {user.displayName || user.email}</p>
          <button className="auth-button" onClick={handleSignOut}>Sign out</button>
        </div>
      ) : (
        <button className="auth-button" onClick={handleSignIn} disabled={isSigningIn}>
          {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
        </button>
      )}
    </>
  )
}

export default Header