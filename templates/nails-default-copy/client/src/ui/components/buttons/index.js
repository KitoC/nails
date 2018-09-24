import React from 'react'
import './button.css'

const Button = ({children, onClick, type = 'default'}) => {
    return (
        <button onClick={() => {onClick && onClick()}} className={type + "-button"}>
            {children}
        </button>
    )
}

export default Button
