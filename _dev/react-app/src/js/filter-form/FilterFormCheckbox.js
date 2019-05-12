import React, { Component } from 'react';

class FilterFormCheckbox extends Component {

    render() {
        console.log(this.props);
        return (
            <div className="filter-form-checkbox">
                <input type="checkbox" name="{slug}" id="{slug}" value="show">
                <label for="{slug}">{label}</label>
            </div>
        )
    }
}

export default FilterFormCheckbox;
