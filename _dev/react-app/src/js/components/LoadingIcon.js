import React, { Component } from 'react';

class LoadingIcon extends Component {

    render() {

        return (
            <svg id="loading-icon" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-rolling">
                <circle cx="50" cy="50" fill="none" stroke="#d61" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
                </circle>
            </svg>
        )
    }
}

export default LoadingIcon;
