import { useState } from 'react';
import axios from 'axios';
import styles from './NameForm.module.css';

export default function NameForm({ setResult, setLoading }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);  // Clear previous result immediately
    setError(null);  // Clear previous error
    try {
      const [ageRes, genderRes, nationalityRes] = await Promise.all([
        axios.get(`https://api.agify.io?name=${name}`),
        axios.get(`https://api.genderize.io?name=${name}`),
        axios.get(`https://api.nationalize.io?name=${name}`)
      ]);

      const age = ageRes.data.age;
      const gender = genderRes.data.gender;
      const country = nationalityRes.data.country;

      // If all APIs return no data, handle it as no result
      if (age === null && gender === null && country.length === 0) {
        setResult(null);
      } else {
        setResult({ age, gender, country });
      }
    } catch (error) {
      console.error('Error fetching data', error);
      if (error.response && error.response.status === 429) {
        setError('Too many requests. Please try again later.');
      } else {
        setError('An error occurred while fetching data. Please try again.');
      }
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name"
          required
          className={styles.inputField}
        />
        <button type="submit" className={styles.submitButton}>Guess</button>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
