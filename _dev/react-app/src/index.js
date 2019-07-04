import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable'

import App from './js/App';

const domID = document.getElementById('job-listings');
if (domID) {
    ReactDOM.render(
        <App />,
        domID
    );
}
