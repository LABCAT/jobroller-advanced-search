import React, { Component } from 'react';
import DollarSignIcon from '../components/DollarSignIcon.js';

class JobsListItem extends Component {

    render() {
        const { isShown, isFeatured, showSalaryTag, job_author, job_type, job_category, job_salary, job_salary_custom, job_date, job_address, job_thumbnail, link, title } = this.props;

        if(!isShown){
            return (null);
        }

        let listClasses = isFeatured ? "job job-featured" : "job";

        return (
            <li className={listClasses}>
                <div className="details">
                    <dl className="title-and-location">
                        <dd className="details">
                            <strong className="details">
                                <a href={link} dangerouslySetInnerHTML={{ __html: title.rendered }}>

                                </a>
                            </strong>
                            <strong dangerouslySetInnerHTML={{ __html: job_author }}>

                            </strong>
                            {
                                job_salary_custom !== '' &&
                                <span className="custom-salary">
                                    <DollarSignIcon />
                                    {job_salary_custom}
                                </span>
                            }
                        </dd>
                        <dt>
                            Location
                        </dt>
                        <dd className="location">
                            <strong dangerouslySetInnerHTML={{ __html: job_address}}>

                            </strong>
                        </dd>
                        <dt>
                            Taxonmies
                        </dt>
                        <dd className="taxonomies">
                            {
                                job_type.label !== undefined  &&
                                <span className={"jtype " + job_type.slug}>
                                    {job_type.label}
                                </span>
                            }
                            {
                                showSalaryTag && job_salary.label  !== undefined &&
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
                        </dd>
                    </dl>
                    <dl className="logo-and-date">
                        <dt>
                            Organisation Logo
                        </dt>
                        <dd className="logo" dangerouslySetInnerHTML={{ __html: job_thumbnail }}>

                        </dd>
                        <dt>
                            Date Posted
                        </dt>
                        <dd className="date" dangerouslySetInnerHTML={{ __html: job_date }}>

                        </dd>
                    </dl>
                </div>
            </li>
        )
    }
}

export default JobsListItem;
