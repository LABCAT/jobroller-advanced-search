import React, { Component } from 'react';

class JobListItem extends Component {

    render() {
        const { job_author, job_type, job_date, job_location, job_thumbnail, link, title } = this.props;
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
                            <a href={link}>
                                {title.rendered}
                            </a>
                        </strong>
                        {job_author}
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
