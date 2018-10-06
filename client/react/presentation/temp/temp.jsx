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

  render () {
    return (
      <p>Hello {this.state.username}!</p>
    )
  }
}

export default Temp
