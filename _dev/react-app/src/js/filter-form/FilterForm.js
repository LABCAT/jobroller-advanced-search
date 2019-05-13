import React, { Component } from 'react';
import FilterTypeHolder from './FilterTypeHolder.js';

class FilterForm extends Component {

    render() {
        const { jobSalaries, jobTypes, jobCategories } = this.props;
        return (
            <form onSubmit={this.handleSubmit}>
                <div id="filter-form-inner">
                    <FilterTypeHolder filterType="job-type" label="Job Type" {...jobTypes} />
                    <FilterTypeHolder filterType="job-salary" label="Salary" {...jobSalaries} />
                    <FilterTypeHolder filterType="job-category" label="Category" {...jobCategories} />
                </div>
            </form>
        )
    }
}

export default FilterForm;
