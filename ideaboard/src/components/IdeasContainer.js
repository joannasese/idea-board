import React, { Component } from 'react';
import axios from 'axios';

export default class IdeasContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ideas: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/v1/ideas.json')
    .then(resp => {
      console.log(resp)
      this.setState({ideas: resp.data})
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        {this.state.ideas.map((idea) => {
          return(
            <div className="tile" key={idea.id} >
              <h4>{idea.title}</h4>
              <p>{idea.body}</p>
            </div>
          )
        })}
      </div>
    );
  }
}
