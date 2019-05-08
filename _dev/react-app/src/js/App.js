import React, { Component } from 'react';
import LoadingIcon from './components/LoadingIcon.js';

class App extends Component {
    constructor(props){
        super();
        this.state  = {
            posts: {}
        }
    }

    componentDidMount(){
        let endPoint = 'http://dogoodjobs.localhost/wp-json/wp/v2/jobs';
        fetch(
           endPoint
        ).then(
           res => res.json()
        ).then(
           (responseJson) => {
               let posts = [];
               if(Array.isArray(responseJson) && responseJson.length){
                   posts = responseJson.map(
                       (post)  => {
                            return post;
                        }
                    );
               }
               else {
                   posts.push(
                       responseJson
                   );
               }

               this.setState(
                    {
                        ...this.state,
                        posts
                    }
                );
           }
        )
       .catch((
           error) => {
               console.error(error);
           }
       );
    }

    render() {
        let main = '';
        if(this.state.posts.length){
            console.log(this.state.posts);
        }
        console.log(getUrlVars());
        return (
            <div className="App">
                Teste
            </div>
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
