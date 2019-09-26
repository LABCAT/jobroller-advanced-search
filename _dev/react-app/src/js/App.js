import React, { Component } from 'react';
import GetURLVars from './functions/GetURLVars.js';
import FilterForm from './filter-form/FilterForm.js';
import FilterButtonsHolder from './filter-form/FilterButtonsHolder.js';
import JobsList from './job-list/JobsList.js';
import LoadingIcon from './components/LoadingIcon.js';

import '../scss/main.scss';

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
            searchTerm: '',
            searchLocation: '',
            filters: {
                jobTypes: {},
                jobSalaries: {},
                jobCategories: {},
                jobLocations: {},
            },
            currentFilter: {
                job_type: [],
                job_salary: [],
                job_category: [],
                job_location: [],
            }
        }
    }

    handleFilterUpate(filterOptionKey, filterType) {
        let filters = {...this.state.filters};
        let currentFilter = {...this.state.currentFilter};
        let postKey = '';
        switch (filterType){
            case "jobSalaries":
                postKey = 'job_salary';
                break;
            case "jobCategories":
                postKey = 'job_category';
                break;
            case "jobLocations":
                postKey = 'job_location';
                break;
            default:
                postKey = 'job_type';
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


    updatePostDisplay() {
        let posts = [...this.state.posts];

        for (var i = 0; i < posts.length; i++) {
            posts[i].isShown = this.matchesCurrentFilter(posts[i]);
        }

        this.setState(
            {
                ...this.state,
                posts
            }
        );
    }

    matchesCurrentFilter(jobListing){
        //first set the post to hidden
        let isShown = false;
        //then check if the post matches current search term and location
        isShown = this.matchesSearchTerm(jobListing);
        //now get the current filters and check if they are empty
        let currentFilter = {...this.state.currentFilter};
        let emptyFilter = (!currentFilter.job_type.length && !currentFilter.job_salary.length && !currentFilter.job_category.length && !currentFilter.job_location.length);

        //only need to check if a job matches the current filters if the filter is not empty
        if(isShown && !emptyFilter) {
            let matches = true;
            let filterKeys =  Object.keys(currentFilter);

            for (const filterKey of filterKeys) {
                //a job matches the current taxonomy filter if it matches at least one of the selected options for a taxonomy
                //when a taxonomy filter is empty then all jobs are considered to be matching
                if(matches && currentFilter[filterKey].length) {
                    console.log(currentFilter[filterKey]);
                    console.log(jobListing[filterKey]);
                    matches = currentFilter[filterKey].includes(jobListing[filterKey].key);
                }
            }

            isShown = matches;
        }

        return isShown;
    }

    matchesSearchTermAndLocation(jobListing){
        let searchTerm = this.state.searchTerm.toLowerCase();
        let searchLocation = this.state.searchLocation.toLowerCase();
        if(searchTerm && searchLocation){
            let matchesTerm = this.matchesSearchTerm(jobListing, searchTerm);
            let matchesLocation = this.matchesSearchLocation(jobListing, searchLocation);
            return (matchesTerm && matchesLocation) ? true : false;
        }
        else if(searchTerm){
            return this.matchesSearchTerm(jobListing, searchTerm);
        }
        else if(searchLocation){
            return this.matchesSearchLocation(jobListing, searchLocation);
        }
        return true;
    }

    matchesSearchTerm(jobListing){
        let searchTerm = this.state.searchTerm.toLowerCase();
        let title = jobListing.title.rendered.toLowerCase();
        let content = jobListing.content.rendered.toLowerCase();
        //if there is no search term then all jobs are matching
        if (title.includes(searchTerm) || content.includes(searchTerm) || !searchTerm){
            return true;
        }
        return false;
    }


    matchesSearchLocation(jobListing, searchLocations){
        let searchLocation = this.state.searchLocation.toLowerCase();
        let location = jobListing.job_location.toLowerCase();
        console.log(searchLocations);
        console.log(jobListing);
        
        if(location.includes(searchLocation)){
            return true;
        }
        return false;
    }

    fetchPosts(page){
        let endPoint = this.state.siteURL + '/wp-json/wp/v2/jobs?page=' + page;
        fetch(
           endPoint,
           {
              headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               }
            }
        ).then(
            (response) => {
                if(this.state.currentPaginationPage < 2){
                    let totalPosts = response.headers.get("X-WP-Total");
                    let paginatedPages = parseInt(response.headers.get("X-WP-TotalPages"));

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
                        let jobLocations = {};
                        
                        if(Array.isArray(responseJson) && responseJson.length){
                            newPosts = responseJson.map(
                                (post)  => {
                                    if(post.listingType !== 'voluntary' && this.matchesSearchTerm(post)){
                                        if (! (post.job_type.slug in this.state.filters.jobTypes)) {
                                            if (post.job_type.slug !== undefined){
                                                jobTypes[post.job_type.slug] = {
                                                    'id': post.job_type.ID,
                                                    'key': post.job_type.slug,
                                                    'label': post.job_type.label,
                                                    'isSelected' : false
                                                }
                                            }
                                        }
                                        if (! (post.job_salary.slug in this.state.filters.jobSalaries)) {
                                            if (post.job_salary.slug !== undefined){
                                                jobSalaries[post.job_salary.slug] = {
                                                    'id': post.job_salary.ID,
                                                    'key': post.job_salary.slug,
                                                    'label': post.job_salary.label,
                                                    'isSelected' : false
                                                }
                                            }
                                        }
                                        if (! (post.job_category.parentSlug in this.state.filters.jobCategories)) {
                                            if (post.job_category.parentSlug !== undefined){
                                                jobCategories[post.job_category.parentSlug]  = {
                                                    'id': post.job_category.parentID,
                                                    'key': post.job_category.parentSlug,
                                                    'label': post.job_category.parentLabel,
                                                    'isSelected' : false
                                                }
                                            }
                                        }
                                        if (!(post.job_location.slug in this.state.filters.jobLocations)) {
                                            if (post.job_location.slug !== undefined) {
                                                jobLocations[post.job_location.slug] = {
                                                    'id': post.job_location.ID,
                                                    'key': post.job_location.slug,
                                                    'label': post.job_location.label,
                                                    'sortOrder': post.job_location.sortOrder,
                                                    'isSelected': false
                                                }
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
                        jobLocations = { ...this.state.filters.jobLocations, ...jobLocations };
                        this.setState(
                            {
                                ...this.state,
                                posts,
                                filters: {
                                    jobTypes,
                                    jobSalaries,
                                    jobCategories,
                                    jobLocations
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
        let searchTerm = '';
        let searchLocation = '';
        let urlVars = GetURLVars();

        if(urlVars.hasOwnProperty("s")){
            searchTerm = urlVars.s;
        }

        if(urlVars.hasOwnProperty("location")){
            searchLocation = urlVars.location;
        }

        this.setState(
            {
                ...this.state,
                siteURL,
                searchTerm,
                searchLocation
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
                    if (job.isFeatured && job.isShown && job.listingType !== 'voluntary') {
                        return job;
                    }
                    return null;
                }
            );
            let jobs = this.state.posts.filter(
                function(job){
                    if (!job.isFeatured && job.isShown && job.listingType !== 'voluntary') {
                        return job;
                    }
                    return null;
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
            
            if(jobs.length || featuredJobs.length){
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
            else if(this.state.currentPaginationPage >= this.state.paginatedPages){
                sections = <p className="jobs">No jobs found.</p>
            }
        }
        return (
            <React.Fragment>
                {filtersArea}
                {sections}
            </React.Fragment>
        );
    }
}

export default App;
