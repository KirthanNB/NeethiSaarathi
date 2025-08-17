import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [q, setQ] = useState('');
  const [ans, setAns] = useState('');

  const ask = async () => {
    try {
      const { data } = await axios.post('/api/query', { q });
      setAns(data.answer);
    } catch (e) {
      setAns('Error: ' + e.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>NeethiSaarathi – Ask Indian Law</h1>
      <textarea
        rows={4}
        style={{ width: '100%' }}
        placeholder="Type your question…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button onClick={ask} style={{ marginTop: '0.5rem' }}>
        Ask
      </button>
      <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{ans}</pre>
    </div>
  );
}