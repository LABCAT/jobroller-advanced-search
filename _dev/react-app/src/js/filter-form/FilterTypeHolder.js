import React, { Component } from 'react';
import FilterFormCheckbox from './FilterFormCheckbox.js';

class FilterTypeHolder extends Component {

    render() {
        const { filterType, label, ...options } = this.props;
        return (
            <div className="filter-type-holder">
                <label className="toggle" data-filter-type={filterType}>
                    {label}
                </label>
                <fieldset id={filterType + "-filter"}>
                    {
                        Object.keys(options).map(
                            key => (
                                <FilterFormCheckbox
                                    key={key}
                                    id={key}
                                    label={options[key]}
                                 />
                            )
                        )
                    }
                </fieldset>
            </div>
        )
    }
}

export default FilterTypeHolder;


//
