import React, { Component } from 'react';
import FilterTypeDropDown from './FilterTypeDropDown.js';

class FilterForm extends Component {

    handleFilterTypeUpdate(event, filterType) {
        event.preventDefault();
        this.props.handleFilterUpate(event.target.name, filterType);
    };

    render() {
        const { jobSalaries, jobTypes, jobCategories} = this.props;
        return (
            <form id="filter-form">
                <div id="filter-form-inner">
                    <FilterTypeDropDown
                        filterType="job-type"
                        label="Job Type"
                        onDropDownItemSelect={ (e) => this.handleFilterTypeUpdate(e, "jobTypes") }
                        {...jobTypes}
                    />
                    <FilterTypeDropDown
                        filterType="job-salary"
                        label="Salary"
                        onDropDownItemSelect={ (e) => this.handleFilterTypeUpdate(e, "jobSalaries") }
                        {...jobSalaries}
                    />
                    <FilterTypeDropDown
                        filterType="job-category"
                        label="Category"
                        onDropDownItemSelect={ (e) => this.handleFilterTypeUpdate(e, "jobCategories") }
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
