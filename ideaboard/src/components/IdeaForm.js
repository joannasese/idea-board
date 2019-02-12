import React, { Component } from 'react';
import axios from 'axios';

export default class IdeaForm extends Component {
  constructor(props) {
    super(props)
    // hook up form input fields to state
    this.state = {
      title: this.props.idea.title,
      body: this.props.idea.body
    }
  }

  handleInput = (event) => {
    this.props.resetNotification()
    this.setState({[event.target.name]: event.target.value})
  }

  handleBlur = () => {
    const idea = {
      title: this.state.title,
      body: this.state.body
    }
    // make PUT call to API endpoint for updating ideas with idea data from the state
    axios.put(`http://localhost:3001/api/v1/ideas/${this.props.idea.id}`,
      {
        idea: idea
      })
      .then(resp => {
        console.log(resp)
        // send edited idea back up to IdeasContainer
        // use method 'updateIdea' passed as prop from IdeasContainer
        this.props.updateIdea(resp.data)
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div className="tile">
        <form onBlur={this.handleBlur}>
          <input
            className='input'
            type='text'
            name='title'
            placeholder='Enter a Title'
            value={this.state.title}
            onChange={this.handleInput}
            // changes cursor focus
            ref={this.props.titleRef}
          />
          <textarea
            className='input'
            name='body'
            placeholder='Describe your idea'
            value={this.state.body}
            onChange={this.handleInput}
          ></textarea>
        </form>
      </div>
    )
  }
}
