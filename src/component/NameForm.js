import { useState } from 'react';
import axios from 'axios';
import styles from './NameForm.module.css';

// Define the NameForm component
export default function NameForm({ setResult, setLoading }) {
    // State variables for name input and error handling
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
  
    // Function to handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      setLoading(true); // Set loading state to true
      setResult(null); // Clear previous result immediately
      setError(null); // Clear previous error immediately
      try {
        // Fetch data from multiple APIs concurrently
        const [ageRes, genderRes, nationalityRes] = await Promise.all([
          axios.get(`https://api.agify.io?name=${name}`),
          axios.get(`https://api.genderize.io?name=${name}`),
          axios.get(`https://api.nationalize.io?name=${name}`)
        ]);
  
        // Extract data from API responses
        const age = ageRes.data.age;
        const gender = genderRes.data.gender;
        const country = nationalityRes.data.country;
  
        // If all APIs return no data, handle it as no result
        if (age === null && gender === null && country.length === 0) {
          setResult(null); // Set result to null
        } else {
          setResult({ age, gender, country }); // Set result with fetched data
        }
      } catch (error) {
        // Log error to console
        console.error('Error fetching data', error);
        // Handle different error scenarios
        if (error.response && error.response.status === 429) {
          setError('Too many requests. Please try again later.'); // Set error message for rate limit exceeded
        } else {
          setError('An error occurred while fetching data. Please try again.'); // Set generic error message
        }
        setResult(null); // Clear result
      } finally {
        setLoading(false); // Set loading state to false after data fetching is complete
      }
    };
  
    // Render form and error message
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
