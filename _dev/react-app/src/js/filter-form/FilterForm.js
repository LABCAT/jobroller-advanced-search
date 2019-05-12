import React, { Component } from 'react';

class FilterForm extends Component {

    render() {
        console.log(this.props);
        return (
            <form onSubmit={this.handleSubmit}>
                <div id="filter-form-inner">

                </div>
            </form>
        )
    }
}

export default FilterForm;
