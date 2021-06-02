import React, { Component } from 'react';
import FilterTypeDropDown from './FilterTypeDropDown.js';

class FilterForm extends Component {

    handleFilterTypeUpdate(event, filterType) {
        event.preventDefault();
        this.props.handleFilterUpate(event.target.name, filterType);
    };

    render() {
        const { jobSalaries, jobTypes, jobCategories, jobLocations, showSalaryFilter } = this.props;
        return (
            <form id="filter-form">
                <div id="filter-form-inner" className={showSalaryFilter ? 'four-filters' : 'three-filters'}>
                    <FilterTypeDropDown
                        filterType="job-type"
                        label="Job Type"
                        onDropDownItemSelect={ (e) => this.handleFilterTypeUpdate(e, "jobTypes") }
                        {...jobTypes}
                    />
                    { showSalaryFilter &&
                        <FilterTypeDropDown
                            filterType="job-salary"
                            label="Salary"
                            onDropDownItemSelect={ (e) => this.handleFilterTypeUpdate(e, "jobSalaries") }
                            {...jobSalaries}
                        />
                    }
                    <FilterTypeDropDown
                        filterType="job-category"
                        label="Category"
                        onDropDownItemSelect={ (e) => this.handleFilterTypeUpdate(e, "jobCategories") }
                        {...jobCategories}
                    />
                    <FilterTypeDropDown
                        filterType="job-location"
                        label="Location"
                        onDropDownItemSelect={(e) => this.handleFilterTypeUpdate(e, "jobLocations")}
                        className="last"
                        {...jobLocations}
                    />
                </div>
                <div className="clear"></div>
            </form>
        )
    }
}

export default FilterForm;
