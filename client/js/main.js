import '../css/main.scss'

import React from 'react'
import ReactDOM from 'react-dom'

let world = 'mundo'
console.log(`Hola ${world}!`)

// ideally if there is any jsx in a file, extension should be jsx as its not standard js
// for now its fine since this is just a test file to ensure everything works for now

let App = function () {
  return <h3>Hello Danica, from React!</h3>
}

ReactDOM.render(
  <App/>,
  document.getElementById('index')
)
