import React, { Component } from 'react';
import { axiosInstance } from '../axios';
import { getEntities } from '../urls';


export default class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: [],
      user: [],
    }
  }

  componentDidMount() {
    axiosInstance.get(getEntities).then((res) => {
      const entitiesData = res.data;
      this.setState({entities: res.data});
      console.log(entitiesData);
      console.log("Done! Test page!");
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