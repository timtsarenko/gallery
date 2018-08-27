# Gallery
> Interactive art galleries for the web.

## Why
Artwork shouldn't have to be limited by lists. It shouldn't have to be contained in separate posts. Visitors shouldn't have to enjoy pieces of a collection individually. 

Gallery aims to solve these issues through interactive 3D art galleries that allow artwork to reside in a gallery, group related pieces together, and allows visitors to enjoy artwork in both a holistic and individual manner. 

We hope to change how artists and museums share their artwork online.

## Structure
The app is separated by concerns. Anything that directly concerns the server is located under `server` and anything concerning the client is located under `client`.

```bash
├── index.js        # app starts here
├── config          # contains configurations and setup for express, mongoose, and the environment
├── server          # code concerning the server
│   ├── routes
│   └── models
├── client          # code/content concerning the client
│   ├── css
│   ├── img
│   ├── js          # contains the React components 
│   └── views
└── build           # compiled files
```

## Installing
First install node.js and then build the project from source using these steps:
```
$ git clone https://github.com/owlsketch/gallery.git
$ cd gallery
$ npm install
```

## Setup
Once everything is installed, you will need to set up a .env file in the project's root directory. It will hold all the environment variables needed by our project. This file should not be shared with anyone and is ignored by git through .gitignore. The .env file must be structured like such:
```dosini
NODE_ENV=development
DB_USER=Pablo
DB_PWD=ElPasswordoDePablo
```
`NODE_ENV` should reflect wether you are developing (development) or deploying (production).
`DB_USER` and `DB_PWD` should be your username and password for the mLab MongoDB database we are accessing via Mongoose.

## Developing
To run our server:
```
$ npm start
```
By running `npm start`, webpack will build all our front-end files and nodemon will start the server. Both webpack and nodemon are listening to the files and if they notice any change, will automatically rebuild the project. With both webpack and nodemon running, you are now free to code and view the changes immediately.

Before commiting any changes, run ESLint to ensure adherence to our coding patterns.
```
$ npm run linter -s
```
if you want ESLint to automatically fix any problems it can automatically resolve, then [add the --fix argument to the command](https://stackoverflow.com/a/14404223):
```
$ npm run linter -s -- --fix
```

## Deploying
For deployment, ensure that the `NODE_ENV` variable in your .env file is set to production. Then build all your front-end files for production with:
```
$ npm run build:prod
```
Finally, start your server with a CLI tool like forever to ensure it is running indefinitely:
```
$ forever start index.js
```

## Authors
**Danica Sapit** and **Gibran Garcia**.
