import React, { Component } from 'react';
import FilterTypeHolder from './FilterTypeHolder.js';

class FilterForm extends Component {

    handleFilterTypeUpdate(filterType, name) {
        console.log(filterType);
        console.log(name);
        this.props.handleFilterUpate(filterType, name);
    };

    render() {
        const { jobSalaries, jobTypes, jobCategories, handleFilterUpate } = this.props;
        return (
            <form>
                <div id="filter-form-inner">
                    <FilterTypeHolder
                        filterType="job-type"
                        label="Job Type"
                        handleFilterTypeUpdate={this.handleFilterTypeUpdate}
                        {...jobTypes}
                    />
                    <FilterTypeHolder
                        filterType="job-salary"
                        label="Salary"
                        handleFilterTypeUpdate={this.handleFilterTypeUpdate}
                        {...jobSalaries}
                    />
                    <FilterTypeHolder
                        filterType="job-category"
                        label="Category"
                        handleFilterTypeUpdate={this.handleFilterTypeUpdate}
                        {...jobCategories}
                    />
                </div>
            </form>
        )
    }
}

export default FilterForm;
