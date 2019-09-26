import React, { Component } from 'react';
import ClearAllButton from './ClearAllButton.js';
import FilterButton from './FilterButton.js';

class FilterButtonsHolder extends Component {

    handleFilterTypeUpdate(name, filterType) {
        this.props.handleFilterUpate(name, filterType);
    }

    handleClearAllFilters(){
        this.props.handleClearFilters();
    }

    render() {
        const { jobSalaries, jobTypes, jobCategories, jobLocations} = this.props;
        const filterTypes = {
            'jobTypes': jobTypes,
            'jobSalaries': jobSalaries,
            'jobCategories': jobCategories,
            'jobLocations': jobLocations,
        }
        const filterTypeKeys = Object.keys(filterTypes);

        let selectedOptions = [];

        for (const filterTypeKey of filterTypeKeys) {
            const keys = Object.keys(filterTypes[filterTypeKey]);
            for (const key of keys) {
               if(filterTypes[filterTypeKey][key].isSelected){
                   let button = {
                       'key': key,
                       'name': key,
                       'label': filterTypes[filterTypeKey][key].label,
                       'filterType': filterTypeKey
                   }
                   selectedOptions.push(button);
               }
            }
        }


        const buttons = selectedOptions.map(
            (option) => (
                <FilterButton
                    {...option}
                    onButtonClick={ (e) => this.handleFilterTypeUpdate(option.name, option.filterType) }
                 />
            )
        );

        const clearAllButton =
            selectedOptions.length < 2
            ? ''
            :
            <ClearAllButton
                onButtonClick={ (e) => this.handleClearAllFilters() }
            />;

        return (
            <div id="filter-buttons-holder">
                {buttons}
                {clearAllButton}
                <div className="clear"></div>
            </div>
        )
    }
}

export default FilterButtonsHolder;
