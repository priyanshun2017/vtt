'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from '../styles/Dashboard.module.css';

export default function DashboardPage() {
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  const handleProcessClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
      });

      const data = await res.json();
      setMessage(data.message || (res.ok ? 'Success' : 'Error'));
    } catch {
      setMessage('Failed to connect to the server.');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <nav className={styles.navbar}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </nav>

      <main className={styles.mainContent}>
        <h3>Submit a Link for Processing</h3>
        <form onSubmit={handleProcessClick} className={styles.processForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="link">File Link</label>
            <input
              type="text"
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/your-file"
              required
            />
          </div>
          <button type="submit" className={styles.processButton} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Start Process'}
          </button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </main>
    </div>
  );
}
