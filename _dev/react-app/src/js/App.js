import React, { Component } from 'react';
import FilterForm from './filter-form/FilterForm.js';
import FilterButtonsHolder from './filter-form/FilterButtonsHolder.js';
import JobsList from './job-list/JobsList.js';
import JobsListItem from './job-list/JobsListItem.js';
import LoadingIcon from './components/LoadingIcon.js';

import '../scss/filter-form.scss';
import '../scss/job-list-item.scss';

class App extends Component {
    constructor(props){
        super();
        this.handleFilterUpate = this.handleFilterUpate.bind(this);
        this.handleClearFilters = this.handleClearFilters.bind(this);
        this.state  = {
            siteURL: '',
            totalPosts: 0,
            paginatedPages: 0,
            currentPaginationPage: 1,
            posts: [],
            filters: {
                jobTypes: {},
                jobSalaries: {},
                jobCategories: {}
            },
            currentFilter: {
                job_type: [],
                job_salary: [],
                job_category: []
            }
        }
    }

    handleFilterUpate(filterOptionKey, filterType) {
        let filters = {...this.state.filters};
        let currentFilter = {...this.state.currentFilter};
        let postKey = '';
        switch (filterType){
            case "jobTypes":
                postKey = 'job_type';
                break;
            case "jobSalaries":
                postKey = 'job_salary';
                break;
            case "jobCategories":
                postKey = 'job_category';
                break;
        }

        filters[filterType][filterOptionKey].isSelected = ! filters[filterType][filterOptionKey].isSelected;
        if(filters[filterType][filterOptionKey].isSelected){
            currentFilter[postKey].push(filterOptionKey);
        }
        else {
            let index = currentFilter[postKey].indexOf(filterOptionKey);
            if (index > -1) {
                currentFilter[postKey].splice(index, 1);
            }
        }

        this.setState(
            {
                ...this.state,
                filters,
                currentFilter
            }
        );

        this.updatePostDisplay(currentFilter);
    }

    handleClearFilters() {
        let filters = {...this.state.filters};
        let filterKeys =  Object.keys(filters);
        let currentFilter = {...this.state.currentFilter};
        let currentFilterKeys =  Object.keys(currentFilter);

        for (const fKey of filterKeys) {
            let keys = Object.keys(filters[fKey])
            for (let key of keys) {
                filters[fKey][key].isSelected = false;
            }
        }

        for (const cfKey of currentFilterKeys) {
            let array = currentFilter[cfKey];
            const length = array.length;
            if(length){
                for( let i = 0; i < length; i++){
                    array.splice(0, 1);
                }
            }
        }

        this.setState(
            {
                ...this.state,
                filters,
                currentFilter
            }
        );
        this.updatePostDisplay(currentFilter);
    }


    updatePostDisplay(currentFilter) {
        let posts = [...this.state.posts];
        let filterKeys =  Object.keys(currentFilter);
        let emptyFilter = true;

        for (var i = 0; i < posts.length; i++) {
            //first set the post to hidden
            posts[i].isShown = false;
            for (const filterKey of filterKeys) {
                if(currentFilter[filterKey].length) {
                    emptyFilter = false;
                    let index = currentFilter[filterKey].indexOf(posts[i][filterKey].key);
                    //if the post matches one of the current filters
                    if (index > -1) {
                        posts[i].isShown = true;
                        //then move to check the next post
                        break;
                    }
                }
            }
            //if the current filter is empty show all posts
            if(emptyFilter) {
                posts[i].isShown = true;
            }
        }

        this.setState(
            {
                ...this.state,
                posts
            }
        );
    }

    matchesCurrentFilter(jobListing){
        let isShown = false;
        let emptyFilter = true;
        let currentFilter = {...this.state.currentFilter};
        let filterKeys =  Object.keys(currentFilter);

        for (const filterKey of filterKeys) {
            if(currentFilter[filterKey].length) {
                emptyFilter = false;
                let index = currentFilter[filterKey].indexOf(jobListing[filterKey].key);
                //if the post matches one of the current filters
                if (index > -1) {
                    isShown = true;
                    //rest of the filters don't need to be checked
                    break;
                }
            }
        }

        //if the current filter is empty all posts should be shown
        if(emptyFilter) {
            isShown = true;
        }

        return isShown;
    }

    fetchPosts(page){
        let endPoint = this.state.siteURL + '/wp-json/wp/v2/jobs?page=' + page;
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
                                    post.isShown = this.matchesCurrentFilter(post);
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
        let siteURL = window.RJA.siteURL;
        this.setState(
            {
                ...this.state,
                siteURL
            }
        );
        window.addEventListener(
            'load',
            () => {
                this.fetchPosts(this.state.currentPaginationPage);
            }
        );
    }

    render() {
        let filtersArea = '';
        let sections =  <LoadingIcon/>
        if(this.state.posts.length){
            let featuredJobs = this.state.posts.filter(
                function(job){
                    if (job.isFeatured && job.isShown) {
                        return job;
                    }
                }
            );
            let jobs = this.state.posts.filter(
                function(job){
                    if (!job.isFeatured && job.isShown) {
                        return job;
                    }
                }
            );
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
                                        handleClearFilters={ this.handleClearFilters }
                                        {...filters}
                                    />
                                }
                            </React.Fragment>
            sections =
                    <React.Fragment>
                        {
                            <JobsList
                                jobs={featuredJobs}
                                title="Featured Jobs"
                                rssLink={this.state.siteURL + '/feed/?rss_featured=1'}
                            />
                        }
                        {
                            <JobsList
                                jobs={jobs}
                                title="Latest Jobs"
                                rssLink={this.state.siteURL + '/feed/?post_type=job_listing'}
                            />
                        }
                        {
                            (this.state.currentPaginationPage <= this.state.paginatedPages) ? <LoadingIcon/> : ''
                        }
                    </React.Fragment>
        }
        return (
            <React.Fragment>
                {filtersArea}
                {sections}
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
