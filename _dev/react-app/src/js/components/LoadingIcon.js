import React, { Component } from 'react';

class LoadingIcon extends Component {

    render() {

        return (
            <svg id="loading-icon" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-rolling" style="background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;">
                <circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#ff727d" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
                    <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite">
                    </animateTransform>
                </circle>
            </svg>
        )
    }
}

export default LoadingIcon;
