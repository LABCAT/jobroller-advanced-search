import React, { Component } from 'react';
import FilterForm from './filter-form/FilterForm.js';
import JobListItem from './components/JobListItem.js';
import LoadingIcon from './components/LoadingIcon.js';

class App extends Component {
    constructor(props){
        super();
        this.state  = {
            totalPosts: 0,
            paginatedPages: 0,
            currentPaginationPage: 1,
            posts: []
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
                        if(Array.isArray(responseJson) && responseJson.length){
                            newPosts = responseJson.map(
                                (post)  => {
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
                        this.setState(
                            {
                                ...this.state,
                                posts,
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

    render() {
        let main = <li className="job loading">
                        <LoadingIcon/>
                    </li>
        if(this.state.posts.length){
            let jobs = this.state.posts;
            main = <React.Fragment>
                        {
                            <FilterForm  {...jobs} />
                        }
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
            <ol className="jobs">
                {main}
            </ol>
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
