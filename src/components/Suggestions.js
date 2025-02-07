import axios from 'axios';
import { useEffect, useState } from 'react';
import '../index.css';
import { debounce } from 'lodash';

const Suggestions = ({ data, setUsername, showSuggestions, setShowSuggestions }) => {

    const [suggestions, setSuggestions] = useState([]); //array of suggestions
    const [searching, setSearching] = useState(false);  //inform user that a request has been made
    const [errorText, setErrorText] = useState(null);   //inform user that nothing found
    const [error, setError] = useState(false);  //hook to trigger errorText display

    //hook to detect if user is entering data
    useEffect(() => {

        const fetchSuggestions = async (data) => {  //function to retrieve suggestions

            if (!showSuggestions) {  //if we dont want any suggestions return 
                setSuggestions([]);
                setSearching(false);
                setErrorText(null);
                setError(false);
                return;   
            }

            try {
                setSearching(true); 

                /* API CALL */
                const response = await axios.get(`https://api.github.com/search/users?q=${data}`);
                
                if (response.data.total_count === 0) {  //response is ok but nothing found
                    setSuggestions([]);
                    setErrorText("No username found");
                    setError(true);
                }
                else
                {
                    setSuggestions(response.data.items);    //response is ok and retrieve the data
                    setErrorText(null); //no error 
                    setError(false);
                }

            } catch(error) {    //something went wrong or no data found
                //console.log(error);
                setSuggestions([]);
            } 
            finally {
                setSearching(false);
            }

        }
        //if user stop typing then send data for the search
        const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

        if (data !== "") {
            debouncedFetchSuggestions(data); // Call the debounced function
        } else {
            setSuggestions([]); // Clear suggestions if data is empty
            setError(null);
        }
 
        return () => debouncedFetchSuggestions.cancel();

    }, [data, showSuggestions]);


    const handleSuggestionClick = (suggestion) => {
        setUsername(suggestion.login); // Fill input field with selected username
        setShowSuggestions(false);
        setSuggestions([]); // Hide suggestions after selection
    };

    if(searching) return <div className="searching">Searching...</div>
    if(error) return <div className="nothingFound">{errorText}</div>

    return (
        suggestions.length > 0 && showSuggestions && (
                <div className="suggestions">
                    <ul className='suggestions_list'>
                        {
                            suggestions.map((user) => 
                                (
                                    <li className='suggestion_list_item' key={user.id} onClick={() => handleSuggestionClick(user)}>
                                        <span>{user.login}</span>
                                    </li>
                                )
                            )
                        }
                        </ul>
                </div>
        )
    )
}

export default Suggestions;