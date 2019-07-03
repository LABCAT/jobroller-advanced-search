import React, { Component } from 'react';
import FilterTypeDropDownItem from './FilterTypeDropDownItem.js';
import DownCaretIcon from '../components/DownCaretIcon.js';

class FilterTypeDropDown extends Component {
    constructor(props){
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            listOpen: false
        }
    }

    handleClickOutside(e){
        if (this.wrapperRef && this.wrapperRef.contains(e.target)){
            // inside click
            return;
        }

        this.setState(
            {
                listOpen: false
            }
        )
    }

    toggleList(e){
        e.preventDefault();
        this.setState(
            prevState => (
                {
                    listOpen: !prevState.listOpen
                }
            )
        )
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    render() {
        const { filterType, label, className, onDropDownItemSelect, ...options } = this.props;
        let classes = className ? className + " filter-type-holder" :  "filter-type-holder";
        let buttonClasses = this.state.listOpen ? 'toggle open' : 'toggle';

        //console.log(options.sort((a,b) => (a.ID > b.ID) ? 1 : ((b.ID > a.ID) ? -1 : 0)));
        let dropdownOptions = Object.keys(options).reduce(
            function(arrayEl, key) {
                arrayEl[key] = optionskey];
                return arrayEl;
            }
        );
        console.log('dropdownOptions');
        console.log(dropdownOptions);
        let list =
            !this.state.listOpen ? ''
            :
            <ul className="dropdown-menu" role="menu">
                {
                    Object.keys(options).map(
                        key => (
                            <FilterTypeDropDownItem
                                key={key}
                                id={key}
                                label={options[key]['label']}
                                isSelected={options[key]['isSelected']}
                                onDropDownItemSelect={onDropDownItemSelect}
                             />
                        )
                    )
                }
            </ul>
        return (
            <div ref={this.setWrapperRef} className={classes}>
                <button
                    className={buttonClasses}
                    onClick={ (e) => this.toggleList(e) }
                >
                    {label}
                    <DownCaretIcon/>
                </button>
                {list}
            </div>
        )
    }
}

export default FilterTypeDropDown;


//
