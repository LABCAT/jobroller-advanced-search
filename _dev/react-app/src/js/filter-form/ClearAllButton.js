import React, { Component } from 'react';

class ClearAllButton extends Component {

    render() {
        const { onButtonClick } = this.props;
        return (
            <button
                id="clear-all"
                onClick={onButtonClick}
            >
                Clear All
            </button>
        )
    }
}

export default ClearAllButton;
