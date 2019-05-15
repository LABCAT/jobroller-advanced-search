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
        const { filterType, label, className, onCheckboxChange, ...options } = this.props;
        let classes = className ? className + " filter-type-holder" :  "filter-type-holder";
        return (
            <SlideToggle
                render = {
                    ({ onToggle, setCollapsibleElement}) =>
                        (
                            <div className={classes}>
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
                                                    label={options[key]['label']}
                                                    isSelected={options[key]['isSelected']}
                                                    onCheckboxChange={onCheckboxChange}
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
