import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';

const domID = document.getElementById('job-listings');
if (domID) {
    ReactDOM.render(
        <App />,
        domID
    );
}
