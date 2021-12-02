import React, { Component, useEffect } from 'react';
import ReactDOM from "react-dom";
import { axiosInstance, blankAxiosInstance } from '../axios';
import Container from '@material-ui/core/Container';
import { getEntities, userGetURL, tokenVerifyURL } from '../urls';


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      user: [],
    }
  }

  componentDidMount() {
    axiosInstance.get(getEntities, { withCredentials: true }).then((res) => {
      const entitiesData = res.data;
      this.setState({entities: res.data});
      console.log(entitiesData);
      console.log("Done!");
    });
    
    //axiosInstance.get(userGetURL, { withCredentials: true }).then((res) => {
    //  const userData = res.data
    //  this.setState({user: res.data});
    //  console.log(userData);
    //  console.log("User data Done!");
    //});

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