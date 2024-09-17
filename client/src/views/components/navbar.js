import React from "react";
import './navbar.css';

export default function Navbar(props){
    return (
        <div className="navbar">
            <a href="https://open.spotify.com/" target="_blank"><img src={require("./spotIcon.png")} alt="Spotify"></img></a>
            <div className="center">
                <h1>SpotMV</h1>
            </div>
            <div className="userProf">
                <h2>{props.name}</h2>
            </div>
        </div>
    )
}