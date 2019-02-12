import React, { Component } from 'react';
import axios from 'axios';
import Idea from './Idea';
import IdeaForm from './IdeaForm';
import update from 'immutability-helper';

export default class IdeasContainer extends Component {
  // props allow us to pass values into our components
  // props are passed down the component tree, from parents to children
  constructor(props) {
    super(props)
    // we use the constructor to set the INITIAL state
    this.state = {
      ideas: [],
      // editingIdeaId keeps track of which idea is being edited
      // by default, we are not editing any idea, so default is null
      editingIdeaId: null,
      notification: ''
    }
  }

  componentDidMount() {
    // fetch('http://localhost:3001/api/v1/ideas.json')
    // .then(resp => resp.json())
    // .then(data => {
    //   this.setState({
    //     ideas: data
    //   })
    // })
    axios.get('http://localhost:3001/api/v1/ideas.json')
    .then(resp => {
      console.log(resp)
      this.setState({ideas: resp.data})
    })
    .catch(error => console.log(error))

  }

  addNewIdea = () => {
    axios.post('http://localhost:3001/api/v1/ideas',
      {idea:
        {
          title: '',
          body: ''
        }
      }
    )
    .then(resp => {
      console.log(resp)
      // update is a function of the immutability helper
      // here we are making a copy of this.state.ideas
      // and inserting new idea to the front of the array
      const ideas = update(this.state.ideas, {
        $splice: [[0,0,resp.data]]
      })
      this.setState({
        ideas: ideas,
        // set new idea id to editingIdeaId
        // indicates that we've added a new idea and want to edit it immediately
        editingIdeaId: resp.data.id
      })
    })
    .catch(error => console.log(error))
  }

  updateIdea = (idea) => {
    // find the index of the edited idea in the array
    const ideaIndex = this.state.ideas.findIndex(x => x.id === idea.id);
    const ideas = update(this.state.ideas, {
      // use $set to replace old value with new one
      [ideaIndex]: { $set: idea }
    })
    // call setState to update state.ideas
    this.setState({
      ideas: ideas,
      notification: 'New idea saved'
    })
  }

  // resets notification as soon as user makes change that hasn't been saved yet
  resetNotification = () => {
    this.setState({notification: ''})
  }

  // set value of state.editingIdeaId to the clicked idea's id
  enableEditing = (id) => {
    this.setState({editingIdeaId: id},
      // use ref to set focus in the title input field
      // by passing focus call in callback, we make sure that it gets called only
      // after the component has been updated
      () => {this.title.focus() })
  }

  deleteIdea = (id) => {
    axios.delete(`http://localhost:3001/api/v1/ideas/${id}`)
    .then(resp => {
      const ideaIndex = this.state.ideas.findIndex(x => x.id === id)
      const ideas = update(this.state.ideas, {$splice: [[ideaIndex, 1]]})
      this.setState({ideas: ideas})
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div>
        <div>
          <button className="newIdeaButton" onClick={this.addNewIdea}>
            New Idea
          </button>
        </div>
        <div>
          <span className='notification'>
            {this.state.notification}
          </span>
        </div>
        {this.state.ideas.map((idea) => {
          // if new idea, renders IdeaForm
          if (this.state.editingIdeaId === idea.id) {
            return (<IdeaForm
              idea={idea}
              key={idea.id}
              updateIdea={this.updateIdea}
              // define ref as callback function
              titleRef={input => this.title = input}
              resetNotification={this.resetNotification}
            />)
          } else {
            // otherwise renders Idea component
            return(<Idea
              idea={idea}
              key={idea.id}
              onClick={this.enableEditing}
              onDelete={this.deleteIdea}
            />)
          }
        })}
      </div>
    );
  }
}
