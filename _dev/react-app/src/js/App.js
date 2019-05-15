import React, { Component } from 'react';
import FilterForm from './filter-form/FilterForm.js';
import FilterButtonsHolder from './filter-form/FilterButtonsHolder.js';
import JobListItem from './components/JobListItem.js';
import LoadingIcon from './components/LoadingIcon.js';

class App extends Component {
    constructor(props){
        super();
        this.handleFilterUpate = this.handleFilterUpate.bind(this);
        this.state  = {
            totalPosts: 0,
            paginatedPages: 0,
            currentPaginationPage: 1,
            posts: [],
            filters: {
                jobTypes: {},
                jobSalaries: {},
                jobCategories: {}
            }
        }
    }

    fetchPosts(page){
        let endPoint = 'http://dogoodjobs.localhost/wp-json/wp/v2/jobs?page=' + page;
        fetch(
           endPoint
        ).then(
            (response) => {
                if(this.state.currentPaginationPage < 2){
                    let totalPosts = response.headers.get("X-WP-Total");
                    let paginatedPages = response.headers.get("X-WP-TotalPages");

                    this.setState(
                        {
                            ...this.state,
                            totalPosts,
                            paginatedPages
                        }
                    );
                }

                response.json().then(
                    (responseJson) => {
                        let newPosts = [];
                        let jobTypes = {};
                        let jobSalaries = {};
                        let jobCategories = {};

                        if(Array.isArray(responseJson) && responseJson.length){
                            newPosts = responseJson.map(
                                (post)  => {
                                    if (! (post.job_type.slug in this.state.filters.jobTypes)) {
                                        if (post.job_type.slug !== undefined){
                                            jobTypes[post.job_type.slug] = {
                                                'label': post.job_type.label,
                                                'isSelected' : false
                                            }
                                        }
                                    }
                                    if (! (post.job_salary.slug in this.state.filters.jobSalaries)) {
                                        if (post.job_salary.slug !== undefined){
                                            jobSalaries[post.job_salary.slug] = {
                                                'label': post.job_salary.label,
                                                'isSelected' : false
                                            }
                                        }
                                    }
                                    if (! (post.job_category.parentSlug in this.state.filters.jobCategories)) {
                                        if (post.job_category.parentSlug !== undefined){
                                            jobCategories[post.job_category.parentSlug]  = {
                                                'label': post.job_category.parentLabel,
                                                'isSelected' : false
                                            }
                                        }
                                    }
                                    return post;
                                }
                            );
                        }
                        else {
                            newPosts.push(
                                responseJson
                            );
                        }


                        let currentPaginationPage = this.state.currentPaginationPage + 1;
                        let posts = this.state.posts.concat(newPosts);
                        jobTypes =  {...this.state.filters.jobTypes, ...jobTypes };
                        jobSalaries =  {...this.state.filters.jobSalaries, ...jobSalaries };
                        jobCategories =  {...this.state.filters.jobCategories, ...jobCategories };
                        this.setState(
                            {
                                ...this.state,
                                posts,
                                filters: {
                                    jobTypes,
                                    jobSalaries,
                                    jobCategories
                                },
                                currentPaginationPage
                            }
                        );

                        if(this.state.currentPaginationPage <= this.state.paginatedPages){

                            this.fetchPosts(this.state.currentPaginationPage);
                        }
                    }
                )
           }
        )
       .catch((
           error) => {
               console.error(error);
           }
       );
    }

    componentDidMount(){
        window.addEventListener(
            'load',
            () => {
                this.fetchPosts(this.state.currentPaginationPage);
            }
        );
    }

    handleFilterUpate(filterOption, filterType) {
        let filters = {...this.state.filters};
        filters[filterType][filterOption].isSelected = ! filters[filterType][filterOption].isSelected;
        this.setState(
            filters
        );
    }

    render() {
        let filtersArea = '';
        let jobsList =  <li className="job loading">
                            <LoadingIcon/>
                        </li>

        if(this.state.posts.length){
            let jobs = this.state.posts;
            let filters = this.state.filters;

            filtersArea =   <React.Fragment>
                                {
                                    <FilterForm
                                        handleFilterUpate={ this.handleFilterUpate }
                                        {...filters}
                                    />
                                }
                                {
                                    <FilterButtonsHolder
                                        handleFilterUpate={ this.handleFilterUpate }
                                        {...filters}
                                    />
                                }
                            </React.Fragment>

            jobsList = <React.Fragment>
                        {
                            jobs.map(
                                job => (
                                    <JobListItem  {...job} />
                                )
                            )
                        }
                        {
                            (this.state.currentPaginationPage <= this.state.paginatedPages) ? <LoadingIcon/> : ''
                        }
                    </React.Fragment>
        }
        return (
            <React.Fragment>
                {filtersArea}
                <ol className="jobs">
                    {jobsList}
                </ol>
            </React.Fragment>
        );
    }
}

function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

export default App;
