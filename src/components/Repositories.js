import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import '../index.css';


const fetchRepos = async ({ queryKey }) => {

    const [_, username, page, sortOrder] = queryKey;

    try{
        const response = await axios.get(`https://api.github.com/users/${username}/repos`,{
                params: {
                    page: page,
                    per_page: 30
                }
            })

            // Sort the repositories by stargazers_count
            const sortedRepos = response.data.sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.stargazers_count - b.stargazers_count; // Ascending order
                } else {
                    return b.stargazers_count - a.stargazers_count; // Descending order
                }
            });

            return sortedRepos;                
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching repositories");
    }
}


const Repositories = ({ username, resetPage }) => {        //username is the username to find repos (in our case is searchQuery)

    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        setPage(1);
    }, [resetPage]);

    const {data, error, isLoading} = useQuery({
        queryKey: ["repos", username, page, sortOrder], 
        queryFn: fetchRepos,
        keepPreviousData: true,
      });

      if (isLoading) return <div className="repo"><p style={{textAlign:'center'}}>Loading...</p></div>;
      if (error) return <div className="repo"><p style={{textAlign:'center'}}>Error fetching repositories!</p></div>;

      return (
        data && data.length === 0 ? (
            <div className="repo">
                <div className='Header'>
                    <label className='labelClass'>Available Repositories</label>
                    
                    <div className='toolbar'>
                        <button onClick={() => setSortOrder((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'))}>Sort by Stars: {sortOrder === 'desc' ? 'Descending' : 'Ascending'}</button>
                        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Prev</button>
                        <span>Page {page}</span>
                        <button onClick={() => setPage((prev) => prev + 1)} disabled={data.length < 30}>Next</button>
                    </div>
                </div>
                <p>No repositories found for {username}</p>
            </div>
        ) : (
            <div className="repo">
                <div className='Header'>
                    <label className='labelClass'>Available Repositories</label>
                    
                    <div className='toolbar'>
                        <button onClick={() => setSortOrder((prevSortOrder) => (prevSortOrder === 'desc' ? 'asc' : 'desc'))}>Sort by Stars: {sortOrder === 'desc' ? 'Descending' : 'Ascending'}</button>
                        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Prev</button>
                        <span>Page {page}</span>
                        <button onClick={() => setPage((prev) => prev + 1)} disabled={data.length < 30}>Next</button>
                    </div>
                </div>
                <ul className="repo_list">
                    {
                        data.map((repo) => (
                            <li className="repo_list_item" key={repo.id}>
                                <h3 style={{textAlign:'center'}}>{repo.name}</h3>
                                <p>{repo.description || "No description"}</p>
                                <p style={{textAlign:'right'}}>⭐ {repo.stargazers_count}</p>
                            </li>
                        ))
                    }
               </ul>
            
            </div>
        )
    )
}

export default Repositories;