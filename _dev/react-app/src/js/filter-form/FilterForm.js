import React, { Component } from 'react';
import FilterTypeHolder from './FilterTypeHolder.js';

class FilterForm extends Component {

    handleFilterTypeUpdate(event, filterType) {
        this.props.handleFilterUpate(event.target.name, filterType);
    };

    render() {
        const { jobSalaries, jobTypes, jobCategories} = this.props;
        return (
            <form id="filter-form">
                <div id="filter-form-inner">
                    <FilterTypeHolder
                        filterType="job-type"
                        label="Job Type"
                        onCheckboxChange={ (e) => this.handleFilterTypeUpdate(e, "jobTypes") }
                        {...jobTypes}
                    />
                    <FilterTypeHolder
                        filterType="job-salary"
                        label="Salary"
                        onCheckboxChange={ (e) => this.handleFilterTypeUpdate(e, "jobSalaries") }
                        {...jobSalaries}
                    />
                    <FilterTypeHolder
                        filterType="job-category"
                        label="Category"
                        onCheckboxChange={ (e) => this.handleFilterTypeUpdate(e, "jobCategories") }
                        className="last"
                        {...jobCategories}
                    />
                </div>
                <div className="clear"></div>
            </form>
        )
    }
}

export default FilterForm;
