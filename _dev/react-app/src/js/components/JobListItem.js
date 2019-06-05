import React, { Component } from 'react';

class JobListItem extends Component {

    render() {
        const { isShown, listingType, job_author, job_type, job_category, job_salary, job_date, job_location, job_thumbnail, link, title } = this.props;

        if(!isShown || listingType === 'voluntary'){
            return (null);
        }

        return (
            <li className="job">
                <dl>

                    <dt>
                        Type
                    </dt>
                    <dd className="type">
                        <span className={"jtype " + job_type.slug}>
                            {job_type.label}
                        </span>
                    </dd>
                    <dt>
                        Job
                    </dt>
                    <dd className="title">
                        <strong>
                            <a href={link} dangerouslySetInnerHTML={{ __html: title.rendered }}>

                            </a>
                        </strong>
                        <span dangerouslySetInnerHTML={{ __html: job_author }}>

                        </span>
                        <br/>
                        <strong>Category: </strong>{job_category.parentLabel}
                        <br/>
                        <strong>Salary: </strong>{job_salary.label}
                    </dd>
                    <dt>
                        Location
                    </dt>
                    <dd className="location">
                        <strong dangerouslySetInnerHTML={{__html: job_location}}>

                        </strong>
                    </dd>
                    <dt>
                        Date Posted
                    </dt>
                    <dd className="date" dangerouslySetInnerHTML={{__html: job_date}}>

                    </dd>
                    <div>
                        <span className='jr_fx_job_listing_thumb jr_fx_r' dangerouslySetInnerHTML={{__html: job_thumbnail}}>

                        </span>
                    </div>
                </dl>
            </li>
        )
    }
}

export default JobListItem;
