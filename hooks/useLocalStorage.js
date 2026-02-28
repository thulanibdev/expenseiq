'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      setValue(item ? JSON.parse(item) : initialValue)
    } catch { setValue(initialValue) }
    setLoaded(true)
  }, [key])

  const set = (val) => {
    const toStore = typeof val === 'function' ? val(value) : val
    setValue(toStore)
    try { localStorage.setItem(key, JSON.stringify(toStore)) } catch {}
  }

  return [value, set, loaded]
}
