'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [cardNumber, setCardNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [cardData, setCardData] = useState(null)
  const [error, setError] = useState('')

  const formatCardNumber = (value) => {
    // Remove all spaces and non-numeric characters, limit to 6 digits
    let cleaned = value.replace(/\s/g, '').replace(/\D/g, '').slice(0, 6)
    return cleaned
  }

  const handleInputChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
    setError('')
    setCardData(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Hide previous results/errors
    setError('')
    setCardData(null)
    
    // Get card number (already cleaned, no spaces)
    const cleanedCardNumber = cardNumber
    
    // Validate BIN/IIN length (exactly 6 digits)
    if (cleanedCardNumber.length !== 6) {
      setError('Please enter exactly 6 digits (BIN/IIN)')
      return
    }
    
    setLoading(true)
    
    try {
      // Call Next.js API route (which proxies to Handi API) - avoids CORS issues
      const response = await fetch(`/api/card?bin=${cleanedCardNumber}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API Error: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('API Response:', data) // Debug log
      
      // Data is already formatted by API route
      setCardData(data)
      
    } catch (err) {
      console.error('Error details:', err)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      
      // More detailed error message
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Network error: Please check your internet connection or CORS settings. API endpoint: https://data.handyapi.com/bin/')
      } else {
        setError(err.message || 'Failed to fetch card information. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Card Information Lookup</h1>
        <p className={styles.subtitle}>Enter your card number to get detailed information</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={cardNumber}
              onChange={handleInputChange}
              placeholder="Enter 6 digits (BIN/IIN)"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              required
            />
            <small className={styles.hint}>Enter the first 6 digits of a card (BIN/IIN)</small>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Submit'}
          </button>
        </form>
        
        {cardData && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Card Details</h2>
            <div className={styles.resultCard}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Scheme:</span>
                <span className={styles.resultValue}>
                  {cardData.scheme && typeof cardData.scheme === 'string' ? cardData.scheme : '-'}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Type:</span>
                <span className={styles.resultValue}>
                  {cardData.type && typeof cardData.type === 'string' ? cardData.type : '-'}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Tier:</span>
                <span className={styles.resultValue}>
                  {cardData.tier && typeof cardData.tier === 'string' ? cardData.tier : '-'}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Luhn:</span>
                <span className={styles.resultValue}>
                  {cardData.luhn !== undefined && cardData.luhn !== null && cardData.luhn !== '' 
                    ? (cardData.luhn === 'true' || cardData.luhn === true ? 'true' : 'false') 
                    : '-'}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Issuer/Bank:</span>
                <span className={styles.resultValue}>
                  {cardData.issuer && typeof cardData.issuer === 'string' ? cardData.issuer : '-'}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Country:</span>
                <span className={styles.resultValue}>
                  {cardData.country && typeof cardData.country === 'string' ? cardData.country : '-'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
