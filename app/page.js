'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conectarea la Supabase (folosind datele tale corecte)
const supabaseUrl = 'https://idtknjvknusmufemmsym.supabase.co';
const supabaseKey = 'sb_publishable_zBiVDEI-sBrnrZhohbte4w_fKd3xFQw';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AgentLogin() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // Încărcăm lista de agenți din baza de date când se deschide pagina
  useEffect(() => {
    async function fetchAgents() {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('id, nume'); 
        
        if (error) {
          console.error('Eroare la preluarea agenților:', error);
        } else {
          setAgents(data || []);
        }
      } catch (err) {
        console.error('Eroare conexiune:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  const handleNumberClick = (num) => {
    if (pin.length < 4 && !verifying) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const handleBack = () => {
    setSelectedAgent(null);
    setPin('');
    setError(false);
  };

  const verifyPin = async (enteredPin) => {
    setVerifying(true);
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', selectedAgent.id)
        .eq('pin', enteredPin)
        .single();

      if (error || !data) {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
          setVerifying(false);
        }, 1200);
      } else {
        setIsLoggedIn(true);
        setVerifying(false);
      }
    } catch (err) {
      setError(true);
      setTimeout(() => {
        setPin('');
        setError(false);
        setVerifying(false);
      }, 1200);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedAgent(null);
    setPin('');
    setError(false);
  };

  if (isLoggedIn && selectedAgent) {
    return (
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Bun venit,</h1>
          <h2 style={styles.welcomeName}>{selectedAgent.nume}!</h2>
          <p style={styles.subtitle}>Autentificare reușită în sistem.</p>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Ieși din cont
          </button>
        </div>
      </main>
    );
  }

  if (selectedAgent) {
    return (
      <main style={styles.container}>
        <div style={styles.card}>
          <button onClick={handleBack} style={styles.backButton}>← Înapoi la listă</button>
          <h1 style={styles.title}>{selectedAgent.nume}</h1>
          <p style={styles.subtitle}>Introduceți codul PIN de 4 cifre</p>

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

          {error && <p style={styles.errorText}>PIN incorect. Încearcă din nou.</p>}
          {verifying && <p style={styles.loadingText}>Se verifică...</p>}

          <div style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                style={styles.keyButton}
                disabled={verifying}
              >
                {num}
              </button>
            ))}
            <button onClick={handleClear} style={styles.keyButtonSpecial} disabled={verifying}>
              Șterge
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              style={styles.keyButton}
              disabled={verifying}
            >
              0
            </button>
            <button 
              onClick={() => pin.length === 4 && verifyPin(pin)} 
              style={styles.keyButtonSubmit}
              disabled={pin.length < 4 || verifying}
            >
              ➔
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>RCP Agent</h1>
        <p style={styles.subtitle}>Selectați agentul din listă</p>

        {loading ? (
          <p style={styles.loadingText}>Se încarcă agenții...</p>
        ) : agents.length === 0 ? (
          <p style={styles.errorText}>Nu s-au găsit agenți în baza de date.</p>
        ) : (
          <div style={styles.agentList}>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                style={styles.agentButton}
              >
                {agent.nume}
              </button>
            ))}
          </div>
        )}
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
  welcomeName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
  },
  agentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  agentButton: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    cursor: 'pointer',
    textAlign: 'left',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#4b5563',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '12px',
    alignSelf: 'flex-start',
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
  loadingText: {
    color: '#059669',
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
  logoutButton: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '16px',
  }
};
