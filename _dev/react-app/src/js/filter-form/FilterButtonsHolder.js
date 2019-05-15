import React, { Component } from 'react';
import FilterButton from './FilterButton.js';

class FilterButtonsHolder extends Component {

    handleFilterTypeUpdate(name, filterType) {
        this.props.handleFilterUpate(name, filterType);
    };

    render() {
        const { jobSalaries, jobTypes, jobCategories} = this.props;
        const filterTypes = {
            'jobTypes': jobTypes,
            'jobSalaries': jobSalaries,
            'jobCategories': jobCategories
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
        )

        return (
            <div id="filter-buttons-holder">
                {buttons}
                <div className="clear"></div>
            </div>
        )
    }
}

export default FilterButtonsHolder;
