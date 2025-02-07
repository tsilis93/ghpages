import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import '../index.css';

const fetchFollowers = async ({ queryKey }) => {
    const [qkey, username, page] = queryKey;

    try{
        console.log(qkey);
        const followersResponse = await axios.get(`https://api.github.com/users/${username}/followers`,{
                params: {
                    page: page,
                    per_page: 30
                }
        })

        const followersWithNames = await Promise.all(
            followersResponse.data.map(async (follower) => {
                const userRes = await axios.get(follower.url);
                const userData = userRes.data;
                return {
                    avatar_url: follower.avatar_url,
                    login: follower.login,
                    name: userData.name
                }
            })
        );

        return followersWithNames;                
    }
    catch (error) {
        console.error(error);
        throw new Error("Error fetching Followers");
    }
}


const Followers = ({ username, resetPage }) => {        //username is the username to find followers (in our case is searchQuery)

    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [resetPage]);

    const {data, error, isLoading} = useQuery({
        queryKey: ["followers", username, page], 
        queryFn: fetchFollowers,
        keepPreviousData: true,
    });
    
    if (isLoading) return <div className="repo"><p style={{textAlign:'center'}}>Loading...</p></div>;
    if (error) return <div className="repo"><p style={{textAlign:'center'}}>Error fetching repositories!</p></div>;
    
    return (
        data && data.length === 0 ? (
            <div className="follow">
               <div className='Header'>
                    <label className='labelClass'>Available Followers</label>
                        
                    <div className='toolbar'>
                        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Prev</button>
                        <span>Page {page}</span>
                        <button onClick={() => setPage((prev) => prev + 1)} disabled={data.length < 30}>Next</button>
                    </div>
                </div>
                <p>No followers found for {username}</p>
            </div>
            ) : (
                <div className="follow">
                    <div className='Header'>
                        <label className='labelClass'>Available Followers</label>
                        
                        <div className='toolbar'>
                            <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Prev</button>
                            <span>Page {page}</span>
                            <button onClick={() => setPage((prev) => prev + 1)} disabled={data.length < 30}>Next</button>
                        </div>
                    </div>
                    <ul className="followers_list">
                        {
                            data.map((follow) => (
                                <li className="follow_list_item" key={follow.id}>
                                    <div className='avatar'><img src={follow.avatar_url} alt={data.login} /></div>
                                    <ul className='profileData'>
                                        <li className='profileListItem'>
                                            <label className='labelClass'>Name:</label>
                                            <span>{follow.name == null ? "" : follow.name}</span>
                                        </li>

                                        <li className='profileListItem'>
                                            <label className='labelClass'>Username:</label>
                                            <span>{follow.login == null ? "" : follow.login}</span>
                                        </li>
                                    </ul>
                                </li>
                            ))
                        }
                   </ul>
                
                </div>
        )
    )
}
    
    export default Followers;