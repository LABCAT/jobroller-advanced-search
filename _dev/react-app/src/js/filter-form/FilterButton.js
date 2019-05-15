import React, { Component } from 'react';

class FilterButton extends Component {

    render() {
        const { name, label, onButtonClick } = this.props;
        return (
            <button
                name={name}
                onClick={onButtonClick}
            >
                {label}
            </button>
        )
    }
}

export default FilterButton;
