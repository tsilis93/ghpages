import '../index.css';

const Profile = ({ data }) => {
    
    return (
        <div className="profile">
            <div className='avatar'><img src={data.avatar_url} alt={data.login} /></div>
            <ul className='profileData'>
                <li className='profileListItem'>
                    <label className='labelClass'>Name:</label>
                    <span>{data.name == null ? "" : data.name}</span>
                </li>

                <li className='profileListItem'>
                    <label className='labelClass'>Username:</label>
                    <span>{data.login == null ? "" : data.login}</span>
                </li>

                <li className='profileListItem'>
                    <label className='labelClass'>Location:</label>
                    <span>{data.location == null ? "" : data.location}</span>
                </li>

                <li className='profileListItem'>
                    <label className='labelClass'>Bio:</label>
                    <span>{data.bio == null ? "" : data.bio}</span>
                </li>

                <li className='profileListItem'>
                    <label className='labelClass'>Public repositories:</label>
                    <span>{data.public_repos}</span>
                </li>

                <li className='profileListItem'>
                    <label className='labelClass'>Followers:</label>
                    <span>{data.followers}</span>
                </li>
            </ul>
        </div>
    )
}

export default Profile;