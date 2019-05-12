import React, { Component } from 'react';

class FilterTypeHolder extends Component {

    render() {
        console.log(this.props);
        return (
            <div class="filter-type-holder">
                <label class="toggle" data-filter-type="job-type">
                    Job Type
                </label>
                <fieldset id={filterType + "-filter"}>
                </fieldset>
            </div>
        )
    }
}

export default FilterTypeHolder;
