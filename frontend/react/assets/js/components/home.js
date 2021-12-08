import React, { Component } from 'react';
import { axiosInstance, blankAxiosInstance } from '../axios';
import { getEntities, userGetURL } from '../urls';


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      user: [],
    }
  }

  componentDidMount() {
    // If user has no tokens, the 2nd axios request will break addNextParam and will cause it to redirect to login page again
    // As a solution, we can make only 1 axiosInstance request (e.g. to get user data) and all other requests will be made with blankAxiosInstance

    // Getting user data
    //axiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
    //  const userData = res.data
    //  this.setState({user: res.data});
    //  console.log(userData);
    //  console.log("User data done!");
    //});

    // get the rest of the data
    axiosInstance.get(getEntities, { withCredentials: true }).then((res) => {
      const entitiesData = res.data;
      this.setState({entities: res.data});
      console.log(entitiesData);
      console.log("Entities data done!");
    });
  }

  render() {
    return (
      <div>
        <h3>Entities</h3>
        {
          Object.entries(this.state.entities).map(([key, entity]) => {
            return(
              <p key={key}>
                entity number {key} _ 
                {entity.description} 
              </p>
            )
          })
        }
        <h3>User data</h3>
        {
          Object.entries(this.state.user).map(([key, data]) => {
            return(
              <p key={key}>
                <span>{key} : {data}</span>
              </p>
            )
          })
        }
      </div>
    );
  }
}