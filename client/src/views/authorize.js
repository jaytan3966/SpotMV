import React from "react";
import './main.css';

export default function Authorize(){
    const api_url = 'https://spotmvserver.onrender.com'

    function userAuthorize(){
        window.location.href = `${api_url}/auth`;
    }

    return (
        <div className="authBg">
            <div className="authorization">
                <h1>New Users</h1>
                <p>SpotMV requires new users to request access by putting down the full name and email of their Spotify account (Limit 25 users).</p>
                <a href="mailto: jaytan3966@gmail.com?subject=Requesting%20SpotMV%20Access&body=Spotify%20Info%0D%0Aname:%20%0D%0Aemail:%20%0D%0A%0D%0ARegards,%0D%0A"><button className="submit">Submit Request</button></a>
            </div>
            <div className="authorization">
                <h1>Demo User</h1>
                <p>To demo SpotMV, use the Spotify account (email: spotmvdemo@gmail.com pwd: demo@spotmv).</p>
                <p>Authorize this account within SpotMV and play music with this account logged in on Spotify.</p>
            </div>
            <div className="authorization">
                <h1>Existing Users</h1>
                <p>If your account already has access, authorize your Spotify account by clicking the button below.</p>
                <button onClick={userAuthorize} className="authBtn">Authorize</button>
            </div>
        </div>
        
    )
}