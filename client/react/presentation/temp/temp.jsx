import React from 'react'

class Temp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: null
    }
  }

  componentDidMount () {
    // get username cookie from document
    let usernameRegex = new RegExp('.*username=([^;]+)')
    let result = usernameRegex.exec(document.cookie)

    // content in regex parenthesis added as second value in
    // our array of data. If it exists, means username found
    if (result.length > 1) {
      window.fetch(`/api/users/${result[1]}`, { method: 'get', credentials: 'include' })
        .then(response => { return response.json() })
        .then(json => { this.setState({ username: json.username }) })
    }
  }

  makeGallery(event) {
    event.preventDefault()
    const data = new FormData(event.target);

    // @todo the slug (:galleryId) needs more validation but will be done in a follow up
    const title = data.get('title') ? data.get('title').trim() : 'Gallery';
    const galleryId = encodeURIComponent(title.toLowerCase().replace(/\s/g, '-'))

    let gallery = {
      title: title,
      private: !!(data.get('private') === 'on')
    }

    // @todo need to check with given user document what galleries a user

    window.fetch(`/api/users/${this.state.username}/galleries/${galleryId}`, { 
      method: 'post',
      body: JSON.stringify(gallery),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => { return response.json() })
    .then(json => {
      // temp, just testing that response comes back as expected
      console.log( json )
    })
  }

  render () {
    return (
      <div className="TmpUserPage">
        <p>Hello {this.state.username}!</p>

        <form onSubmit={this.makeGallery.bind(this)}>
          Gallery Title: <input type="text" name="title" /><br />
          Set as Private: <input type="checkbox" name="private" /><br />
          <button>Create New Gallery</button>
        </form>
      </div>
    )
  }
}

export default Temp
