import React, { Component } from 'react';

class FilterTypeDropDownItem extends Component {

    constructor (props){
        super(props);
        this.handleChildClick = this.handleChildClick.bind(this);
    }

    handleChildClick(e) {
        e.stopPropagation();
        e.preventDefault();
        this.button.click();
    }

    render() {
        const { id, label, isSelected, onDropDownItemSelect } = this.props;
        const itemClass = isSelected ? 'filter-form-option selected' : 'filter-form-option';

        return (
            <li className={itemClass}>
                <button
                    name={id}
                    id={id}
                    onClick={onDropDownItemSelect}
                    ref={button => this.button = button}
                >
                    {label}
                    <span
                        className="remove"
                        onClick={this.handleChildClick}
                    >
                        ×
                    </span>
                </button>
            </li>
        )
    }
}

export default FilterTypeDropDownItem;
