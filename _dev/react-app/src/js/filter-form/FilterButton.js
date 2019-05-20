import React, { Component } from 'react';

class FilterButton extends Component {

    render() {
        const { name, label, onButtonClick } = this.props;
        return (
            <button
                name={name}
                onClick={onButtonClick}
            >
                <span>
                    {label}
                </span>
                <span className="remove">
                    ×
                </span>
            </button>
        )
    }
}

export default FilterButton;
