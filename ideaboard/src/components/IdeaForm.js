import React, { Component } from 'react';
import axios from 'axios';

export default class IdeaForm extends Component {
  constructor(props) {
    super(props)
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

    axios.put(`http://localhost:3001/api/v1/ideas/${this.props.idea.id}`,
      {
        idea: idea
      })
      .then(resp => {
        console.log(resp)
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
