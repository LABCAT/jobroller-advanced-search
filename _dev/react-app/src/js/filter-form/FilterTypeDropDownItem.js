import React, { Component } from 'react';

class FilterTypeDropDownItem extends Component {

    render() {
        const { id, label, isSelected, onDropDownItemSelect } = this.props;
        const itemClass = isSelected ? 'filter-form-option selected' : 'filter-form-option';

        return (
            <li className={itemClass}>
                <button
                    name={id}
                    id={id}
                    onClick={onDropDownItemSelect}
                >
                    {label}
                </button>
                <span className="remove">
                    ×
                </span>
            </li>
        )
    }
}

export default FilterTypeDropDownItem;
