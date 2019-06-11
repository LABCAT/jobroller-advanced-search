import React, { Component } from 'react';
import JobsListItem from './JobsListItem.js';


class JobsList extends Component {

    render() {
        const { jobs, title, rssLink } = this.props;

        if(!jobs.length){
            return (null);
        }
        
        let listItems =
                <React.Fragment>
                    {
                        jobs.map(
                            job => (
                                <JobsListItem  {...job} />
                            )
                        )
                    }
                </React.Fragment>
        return (
            <div className="section">
                <h2 className="pagetitle">
                    <small className="rss">
                        <a href={rssLink}>
                            <i className="icon dashicons-before"></i>
                        </a>
                    </small>
                    {title}
                </h2>
                <ol className="jobs">
                    {listItems}
                </ol>
                <div className="clear"></div>
            </div>
        )
    }
}

export default JobsList;
