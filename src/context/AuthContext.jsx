import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase'

const AuthContext = createContext(null)

// Demo users for testing and grading evaluation
export const DEMO_CUSTOMER = {
  uid: 'demo-customer-101',
  name: 'Suresh Keshwin',
  email: 'suresh.keshwin@gmail.com',
  phone: '+94 77 123 4567',
  role: 'customer',
  createdAt: new Date().toISOString(),
}

export const DEMO_ADMIN = {
  uid: 'demo-admin-001',
  name: 'Admin Stadium Manager',
  email: 'admin@toshibastadium.lk',
  phone: '+94 81 234 5678',
  role: 'admin',
  createdAt: new Date().toISOString(),
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen to Firebase auth state if configured
  useEffect(() => {
    // Check if session was saved locally (for demo mode)
    const storedDemo = localStorage.getItem('tis_demo_session')
    if (storedDemo) {
      try {
        const parsed = JSON.parse(storedDemo)
        setUser({ uid: parsed.uid, email: parsed.email, displayName: parsed.name })
        setProfile(parsed)
        setLoading(false)
        return
      } catch {
        localStorage.removeItem('tis_demo_session')
      }
    }

    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (!firebaseUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(userDocRef)
        if (snap.exists()) {
          setProfile({ uid: firebaseUser.uid, ...snap.data() })
        } else {
          // If doc not created yet, create basic profile
          const initialData = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
            email: firebaseUser.email,
            phone: firebaseUser.phoneNumber || '',
            role: 'customer',
            createdAt: new Date().toISOString(),
          }
          await setDoc(userDocRef, initialData)
          setProfile(initialData)
        }
      } catch (error) {
        console.error('Failed to load user profile from Firestore:', error)
        setProfile({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Customer',
          email: firebaseUser.email,
          role: 'customer',
        })
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  // Email/password Login
  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const res = await signInWithEmailAndPassword(auth, email, password)
      localStorage.removeItem('tis_demo_session')
      return res.user
    }
    // Fallback if Firebase not configured yet
    if (email.toLowerCase().includes('admin')) {
      loginDemo('admin')
      return DEMO_ADMIN
    }
    loginDemo('customer')
    return DEMO_CUSTOMER
  }

  // Register
  const register = async ({ name, email, phone, password }) => {
    if (isFirebaseConfigured && auth && db) {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = res.user

      if (name) {
        await updateFirebaseProfile(firebaseUser, { displayName: name })
      }

      const userData = {
        uid: firebaseUser.uid,
        name: name || '',
        email: email || '',
        phone: phone || '',
        role: 'customer',
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData)
      setProfile(userData)
      localStorage.removeItem('tis_demo_session')
      return firebaseUser
    }

    // Demo register
    const newDemoUser = {
      uid: `demo-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('tis_demo_session', JSON.stringify(newDemoUser))
    setUser({ uid: newDemoUser.uid, email, displayName: name })
    setProfile(newDemoUser)
    return newDemoUser
  }

  // Google Sign-In
  const loginWithGoogle = async () => {
    if (isFirebaseConfigured && auth && googleProvider) {
      const res = await signInWithPopup(auth, googleProvider)
      const firebaseUser = res.user
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      const snap = await getDoc(userDocRef)

      if (!snap.exists()) {
        const newUserData = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Customer',
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber || '',
          role: 'customer',
          createdAt: new Date().toISOString(),
        }
        await setDoc(userDocRef, newUserData)
        setProfile(newUserData)
      } else {
        setProfile({ uid: firebaseUser.uid, ...snap.data() })
      }
      localStorage.removeItem('tis_demo_session')
      return firebaseUser
    }

    // Demo fallback for Google Sign-In
    loginDemo('customer')
    return DEMO_CUSTOMER
  }

  // Password reset
  const sendPasswordReset = async (email) => {
    if (isFirebaseConfigured && auth) {
      return sendPasswordResetEmail(auth, email)
    }
    // Simulation
    return true
  }

  // Sign out
  const logout = async () => {
    localStorage.removeItem('tis_demo_session')
    if (isFirebaseConfigured && auth) {
      await signOut(auth)
    }
    setUser(null)
    setProfile(null)
  }

  // Quick Demo Login for testing and university evaluation
  const loginDemo = (role = 'customer') => {
    const demoData = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER
    localStorage.setItem('tis_demo_session', JSON.stringify(demoData))
    setUser({ uid: demoData.uid, email: demoData.email, displayName: demoData.name })
    setProfile(demoData)
  }

  // Update profile
  const updateProfileData = async (updatedFields) => {
    const newProfile = { ...profile, ...updatedFields }
    setProfile(newProfile)

    if (localStorage.getItem('tis_demo_session')) {
      localStorage.setItem('tis_demo_session', JSON.stringify(newProfile))
    }

    if (isFirebaseConfigured && db && user?.uid) {
      try {
        await updateDoc(doc(db, 'users', user.uid), updatedFields)
      } catch (err) {
        console.error('Failed to update profile doc in Firestore:', err)
      }
    }
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user || profile),
      isAdmin: profile?.role === 'admin',
      isFirebaseConfigured,
      login,
      register,
      loginWithGoogle,
      sendPasswordReset,
      logout,
      loginDemo,
      updateProfileData,
    }),
    [user, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
