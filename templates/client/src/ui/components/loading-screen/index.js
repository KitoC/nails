import React from 'react'
import  './loading-screen.css'


const LoadingScreen = ({loadingText}) => {

    return (
        <div className="loading-screen">
        <div className="gif">
            <iframe src="https://giphy.com/embed/Vuw9m5wXviFIQ" title='rick-rolled' width="480" height="398" frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
        </div>
            <h3>{loadingText}</h3>
        </div>
    )
}

export default LoadingScreen
