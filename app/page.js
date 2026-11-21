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

  // 1. Încărcăm lista de agenți din baza de date când se deschide pagina
  useEffect(() => {
    async function fetchAgents() {
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('id, nume'); // Presupunem că ai coloanele id și nume
        
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
      // Verificăm dacă PIN-ul introdus corespunde agentului selectat
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

  // Ecranul de succes după logare
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

  // Ecranul 2: Introducerea PIN-ului pentru agentul selectat
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

  // Ecranul 1: Lista cu agenți preluați din baza de date
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
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0,
