import { useState } from 'react';
import NameForm from '@/component/NameForm';
import Shimmer from '@/component/Shimmer';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Name Guesser</h1>
      <NameForm setResult={setResult} setLoading={setLoading} />
      {loading && <Shimmer />}
      {!loading && result && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>Age: {result.age}</p>
          <p>Gender: {result.gender}</p>
          <p>
            Nationality:
            {result.country.map((c, index) => (
              <span key={index}>
                {c.country_id} ({(c.probability * 100).toFixed(2)}%){' '}
              </span>
            ))}
          </p>
        </div>
      )}
      {!loading && !result && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}
