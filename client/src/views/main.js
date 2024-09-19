import React, { useState, useEffect } from "react";
import './main.css';
import Navbar from "./components/navbar";
import { useNavigate } from "react-router-dom";

export default function Main(){
    const searchParams = new URLSearchParams(window.location.search);

    //spotify vars
    const [isPlaying, setPlaying] = useState(false);
    const [nextState, setNext] = useState(false);

    //spotify user 
    const [user, setUser] = useState();

    //spotify authentication
    const [accessToken, setToken] = useState(searchParams.get('access_token'));
    const [refreshToken, setRefresh] = useState(searchParams.get('refresh_token'))

    //spotify song info
    const [song, setSong] = useState("Play a song on your Spotify Player!");
    const [songImg, setImg] = useState("https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png");
    const [albumLink, setAlbumLink] = useState();

    //spotify artist info
    const [artistImg, setArtistImg] = useState("https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png");
    const [artist, setArtist] = useState("Spotify");
    const [artistLink, setArtistLink] = useState();

    //youtube vars
    const [videoId, setvideoId] = useState("ZncbtRo7RXs?si=ohl4WCuqvY0JJKub");
    const API_KEY = "AIzaSyBuf83t9pfPd0GJPaFwqg-gkIP6dx195Zw";

    //navigation
    const navigate = useNavigate();

    const api_url = "https://spotmvserver.onrender.com";

    const getRefreshToken = async () => {
        try {
            const result = await fetch(`${api_url}/refresh_token/${refreshToken}`);
            if (!result.ok){
                throw new Error(`Network response was not ok: ${result.statusText}`);
            }
            const token = JSON.parse(await result.text());
            setToken(token.access_token);
            setRefresh(token.refresh_token);
            alert("Refreshed Spotify Token!");
        } catch (error) {
            console.error(error);
        }
    }
    //redirect when new access token granted
    useEffect(() => {
        if (accessToken && refreshToken){
            navigate(`?access_token=${accessToken}&refresh_token=${refreshToken}`);
        }
    }, [accessToken, refreshToken])
    
    //check whether user is playing music on spotify and get their current song info
    const checkPlayState = async () => {
        try {
            const result = await fetch('https://api.spotify.com/v1/me/player', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            try {
                const data = JSON.parse(await result.text());
                setPlaying(data.is_playing);
                if (isPlaying){
                    try{
                        if (song != data.item.name){
                            setNext(!nextState);
                        } else {
                            return;
                        }
                        setSong(data.item.name);
                        setArtist(data.item.artists[0]['name']);
                        setImg(data.item.album.images[0].url);
                        getArtistInfo(data.item.artists[0].id);
                        setAlbumLink(data.item.album.external_urls.spotify);
                    } catch {
                        setSong("Advertisement")
                        setImg("https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png");
                        setAlbumLink();
                    }
                } else {
                    setSong("Play a song in Spotify!");
                    setImg("https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png")
                    setAlbumLink();
                }
            } catch {
                setSong("Refresh your Spotify Token!")
                setPlaying(false);
            }
        } catch (error){
            setSong("Refresh your Spotify Token!")
            setPlaying(false);
        }
    }
    //gets artist information
    const getArtistInfo = async (artistId) => {
        const result = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = JSON.parse(await result.text());
        setArtistImg(data.images[0].url);
        setArtistLink(data.external_urls.spotify);
    }
    //checks user's current status
    useEffect(() => {
        const intervalId = setInterval(checkPlayState, 4000);
        return () => clearInterval(intervalId);
    });
    //gets and sets music video 
    async function getVideoID(){
        try {
            const result = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${song} by ${artist}Song Official MV&part=snippet`);
            const data = await result.json();
            setvideoId(data.items[0].id.videoId);
        } catch {
            alert("MV not found/limited to 100 songs a day");
            setvideoId("m6pTbEz4w3o?si=63bgCZ2ABohgz8_1");
            return;
        }
    }
    //gets new mv when next song played
    useEffect(() => {
        if (isPlaying){
            getVideoID();
        }
    }, [nextState])
    //gets username and profile picture of spotify account
    async function getUserInfo() {
        try {
            const result = await fetch('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await result.json();
            setUser(data.display_name);
        } catch {
            setUser('Refresh Spotify Token');
        }
    }
    useEffect(() => {
        getUserInfo();
    })
    return (
        <div className="bg">
            <Navbar name={user}/>
            <div className="body">
                <div className="mvPlayer">
                    <iframe
                        className="player"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                    ></iframe>
                </div>
                <div>
                    <button onClick={getRefreshToken} className="refreshBtn">Refresh Spotify Token</button>
                    <div className="songDescription">
                        <div className="songInfo">
                            <a href={albumLink} target="_blank"><img src={songImg} alt="Album Cover" className="albumCover"></img></a>
                            <p className="songTitle">{song}</p>
                        </div>
                    </div>
                    <div className="artistDescription">
                        <div className="artistInfo">
                            <h1>{artist}</h1>
                            <a href={artistLink} target="_blank"><img src={artistImg} className="artistCover"></img></a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="faq">
                    <h1>Frequently Asked Questions</h1>
                    <p className="question">Why am I getting an alert message when trying to get a music video?</p>
                    <p className="answer">Your song may not have a music video or you may have hit the 100 song limit per day for accessing Youtube.</p>
                    <p className="question">Am I able to authorize a different account?</p>
                    <p className="answer">Clear your browser's cache.</p>
                    <p className="question">Why does the music video get cut off?</p>
                    <p className="answer">Occasionally the Spotify song and Youtube MV will be different lengths, so the Spotify song might end early.</p>
                </div>
            
        </div>
    )
}

