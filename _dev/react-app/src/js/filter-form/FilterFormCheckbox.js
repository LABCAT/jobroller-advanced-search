import React, { Component } from 'react';

class FilterFormCheckbox extends Component {

    render() {
        const { id, label, isSelected, onCheckboxChange } = this.props;
        return (
            <div className="filter-form-checkbox">
                <input
                    type="checkbox"
                    name={id}
                    id={id}
                    checked={isSelected}
                    onChange={onCheckboxChange}
                />
                <label htmlFor={id}>{label}</label>
            </div>
        )
    }
}

export default FilterFormCheckbox;
