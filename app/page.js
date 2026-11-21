'use client';
import { useState } from 'react';

export default function AgentLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      // Când s-au strâns 4 cifre, simulăm verificarea (ulterior o legăm de Supabase)
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const verifyPin = (enteredPin) => {
    // Aici vom face cererea către Supabase. Pentru moment, testăm cu PIN-ul "1234"
    if (enteredPin === '1234') {
      alert('Autentificare reușită! Bun venit, agent.');
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
      }, 1000);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>RCP Agent</h1>
        <p style={styles.subtitle}>Introduceți codul PIN de 4 cifre</p>

        {/* Afișaj cifre PIN (puncte sau numere) */}
        <div style={styles.pinDisplay}>
          {[0, 1, 2, 3].map((index) => (
            <div 
              key={index} 
              style={{
                ...styles.pinDot, 
                borderColor: error ? '#ef4444' : (pin[index] ? '#059669' : '#d1d5db'),
                backgroundColor: pin[index] ? (error ? '#ef4444' : '#059669') : 'transparent'
              }} 
            />
          ))}
        </div>

        {error && <p style={styles.errorText}>PIN incorect. Încercați din nou.</p>}

        {/* Tastatura numerică */}
        <div style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              style={styles.keyButton}
            >
              {num}
            </button>
          ))}
          <button onClick={handleClear} style={styles.keyButtonSpecial}>
            Șterge
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            style={styles.keyButton}
          >
            0
          </button>
          <button 
            onClick={() => verifyPin(pin)} 
            style={styles.keyButtonSubmit}
            disabled={pin.length < 4}
          >
            ➔
          </button>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'sans-serif',
    padding: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '360px',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  },
  pinDisplay: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  pinDot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    borderWidth: '2px',
    borderStyle: 'solid',
    transition: 'all 0.2s',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '13px',
    marginBottom: '16px',
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  keyButton: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
  },
  keyButtonSpecial: {
    backgroundColor: '#f3f4f6',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4b5563',
    cursor: 'pointer',
  },
  keyButtonSubmit: {
    backgroundColor: '#059669',
    border: 'none',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '20px',
    color: '#ffffff',
    cursor: 'pointer',
  },
};
