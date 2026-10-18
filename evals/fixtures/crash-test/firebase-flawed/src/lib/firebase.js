import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase web config: public by design.
const app = initializeApp({
  apiKey: 'AIzaSyEXAMPLE000',
  authDomain: 'notes-example.firebaseapp.com',
  projectId: 'notes-example',
  storageBucket: 'notes-example.appspot.com',
  appId: '1:000000000000:web:example000000',
})

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
