import React, { Component } from 'react';
import SlideToggle from "react-slide-toggle";

import FilterFormCheckbox from './FilterFormCheckbox.js';
import DownCaretIcon from '../components/DownCaretIcon.js';

class FilterTypeHolder extends Component {

    handleCheckboxChange = changeEvent => {
        const { name } = changeEvent.target;
        const { filterType } = this.props;
        this.props.handleFilterTypeUpdate(filterType, name);
    };

    render() {
        const { filterType, label, handleFilterTypeUpdate, ...options } = this.props;
        return (
            <SlideToggle
                render = {
                    ({ onToggle, setCollapsibleElement}) =>
                        (
                            <div className="filter-type-holder">
                                <label className="toggle" data-filter-type={filterType} onClick={onToggle}>
                                    {label}
                                    <DownCaretIcon/>
                                </label>
                                <fieldset
                                    id={filterType + "-filter"}
                                    ref={setCollapsibleElement}
                                    style={
                                        {
                                            display: 'none'
                                        }
                                    }
                                >
                                    {
                                        Object.keys(options).map(
                                            key => (
                                                <FilterFormCheckbox
                                                    key={key}
                                                    id={key}
                                                    label={options[key]}
                                                    onCheckboxChange={this.handleCheckboxChange}
                                                 />
                                            )
                                        )
                                    }
                                </fieldset>
                            </div>
                        )
                    }
                />
        )
    }
}

export default FilterTypeHolder;


//
