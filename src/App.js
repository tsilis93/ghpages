import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import Suggestions from './components/Suggestions';
import Repositories from './components/Repositories';
import Followers from './components/Followers';
import './index.css';
import axios from 'axios';

const DOMPurify = require('dompurify');

function App() {

  const [username, setUsername] = useState('');   //input and suggestions hook
  const [searchQuery, setSearchQuery] = useState(null);   //user hook
  const [userData, setData] = useState(null);   //user data fetched from api

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true); //hook to manage suggestions
  const [resetPage, setResetPage] = useState(false);  //hook in order to reset page in Repositories component

  
  const fetchUserData = async (searchQuery) => {

    try {
      const response = await axios.get(`https://api.github.com/users/${searchQuery}`);

      setData(response.data);
    }
    catch(error) {    //something went wrong or no data found
      //console.log(error);
      setData(null);
      setError('Username not found');
    } 
    finally {
      setLoading(false);
    }

  }

  /* hook to fetch data from API */
  useEffect(() => {
    
    if(searchQuery != null) {
      fetchUserData(searchQuery);
    }

  }, [searchQuery]);


/* Function in order to handle data before API request */ 
  const searchUser = (e) => {
    e.preventDefault();  // Prevent the form from submitting
    setLoading(true);
    
    let userInput = document.getElementById('userInput').value;

    //we need to sanitize data 
    const cleanInput = DOMPurify.sanitize(userInput);

    if(cleanInput !== searchQuery) { //if changes made then     
      setSearchQuery(cleanInput);    //activate search hook
      setShowSuggestions(false);  //hide suggestions
      setResetPage((prev) => !prev); // Toggle resetPage state to trigger page reset back to 1
      setError(null); // remove the error
    }
    else
    {
      setLoading(false);
      setShowSuggestions(false);  //hide suggestions
    }
  }


  return (
    <div className="container">
      <h1>GitHub Dashboard App</h1>
      <form className='inputForm'>
        <input 
            id="userInput" 
            type='text' 
            onChange={(e) => {
                setUsername(e.target.value);  //store user input 
                setShowSuggestions(true); //trigger suggestions 
              }
            } 
            value={username} 
            placeholder='Please provide username...' 
        />
        <button onClick={searchUser}>Search</button>
        <Suggestions 
          data={username}
          setUsername={setUsername}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions} 
        />
      </form>

      {loading && <div>Loading ....</div> }
      {error && <p className='error-class'>{error}</p>}

      {userData && <Profile data={userData} />}

      {userData && <Repositories username={searchQuery} resetPage={resetPage}/>}

      {userData && <Followers username={searchQuery} resetPage={resetPage}/>}

    </div>
  );
}

export default App;
