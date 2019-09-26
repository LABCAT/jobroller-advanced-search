import React, { Component } from 'react';

class JobsListItem extends Component {

    render() {
        const { isShown, isFeatured, job_author, job_type, job_category, job_salary, job_date, job_address, job_thumbnail, link, title } = this.props;

        if(!isShown){
            return (null);
        }

        let listClasses = isFeatured ? "job job-featured" : "job";

        return (
            <li className={listClasses}>
                <dl>
                    <dd className="title">
                        <strong>
                            <a href={link} dangerouslySetInnerHTML={{ __html: title.rendered }}>

                            </a>
                        </strong>
                        <span dangerouslySetInnerHTML={{ __html: job_author }}>

                        </span>
                    </dd>
                    <dt>
                        Location
                    </dt>
                    <dd className="location">
                        <strong dangerouslySetInnerHTML={{ __html: job_address}}>

                        </strong>
                    </dd>
                    <dt>
                        Date Posted
                    </dt>
                    <dd className="date" dangerouslySetInnerHTML={{__html: job_date}}>

                    </dd>
                    <dt>
                        Organisation Logo
                    </dt>
                </dl>
                <div className="logo" dangerouslySetInnerHTML={{__html: job_thumbnail}}>

                </div>
                <div className="taxonomies">
                    {
                        job_type.label !== undefined  &&
                        <span className={"jtype " + job_type.slug}>
                            {job_type.label}
                        </span>
                    }
                    {
                        job_salary.label  !== undefined &&
                        <span className="salary">
                            {job_salary.label}
                        </span>
                    }
                    {
                        job_category.parentLabel !== undefined &&
                        <span className="category">
                            {job_category.parentLabel}
                        </span>
                    }
                </div>
            </li>
        )
    }
}

export default JobsListItem;
