import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export default function Notes() {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    const mine = query(collection(db, 'notes'), where('ownerId', '==', auth.currentUser.uid))
    getDocs(mine).then((snap) => setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
  }, [])
  async function add(body) {
    await addDoc(collection(db, 'notes'), { body, ownerId: auth.currentUser.uid })
  }
  return <ul>{notes.map((n) => <li key={n.id}>{n.body}</li>)}</ul>
}
