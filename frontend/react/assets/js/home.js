import React, { Component, useEffect } from 'react';
import ReactDOM from "react-dom";
import axiosInstance from './axios';
import Container from '@material-ui/core/Container';


export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
    }
  }

  componentDidMount() {
    axiosInstance.get('http://127.0.0.1:8000/api/v1/entities/').then((res) => {
      const entitiesData = res.data;
      this.setState({entities: res.data})
      console.log(entitiesData);
      console.log("Done!");
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
      </div>
    );
  }
}