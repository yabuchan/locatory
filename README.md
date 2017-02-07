Locatory provides sounds based on location, context (situation of a user), and pre-defined personalities.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
  * Node v5 IS NOT SUPPORTED AT THIS TIME! 
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Ruby - [Download & Install Ruby](https://www.ruby-lang.org/en/documentation/installation/)
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```

* Sass - You're going to use [Sass](http://sass-lang.com/) to compile CSS during your grunt task. Make sure you have ruby installed, and then install Sass using gem install:

```bash
$ gem install sass
```

```bash
$ npm install -g grunt-cli
```

* Gulp - (Optional) You may use Gulp for Live Reload, Linting, and SASS or LESS.

```bash
$ npm install gulp -g
```

## Downloading Locatory


```bash
$ git clone git@github.com:yabuchan/locatory.git
```

## Quick Install
To install Node.js dependencies you're going to use npm again. In the application folder run this in the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application

## Running Your Application
After the install process is over, you'll be able to run your application using Grunt, just run grunt default task:

```
$ grunt
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.
If you encounter any problems, try the Troubleshooting section.

* explore `config/env/development.js` for development environment configuration options

### Running in Production mode
To run your application with *production* environment configuration, execute grunt as follows:

```bash
$ grunt prod
```

* explore `config/env/production.js` for production environment configuration options

### Running with User Seed
To have default account(s) seeded at runtime:

In Development:
```bash
MONGO_SEED=true grunt
```
It will try to seed the users 'user' and 'admin'. If one of the user already exists, it will display an error message on the console. Just grab the passwords from the console.

In Production:
```bash
MONGO_SEED=true grunt prod
```
This will seed the admin user one time if the user does not already exist. You have to copy the password from the console and save it.

### Running with TLS (SSL)
Application will start by default with secure configuration (SSL mode) turned on and listen on port 8443.
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:

```bash
$ sh ./scripts/generate-ssl-certs.sh
```

Windows users can follow instructions found [here](http://www.websense.com/support/article/kbarticle/How-to-use-OpenSSL-and-Microsoft-Certification-Authority).
After you've generated the key and certificate, place them in the *config/sslcerts* folder.

Finally, execute grunt's prod task `grunt prod`
* enable/disable SSL mode in production environment change the `secure` option in `config/env/production.js`


## Testing Your Application
You can run the full test suite included with Locatory with the test task:

```bash
$ grunt test
```

This will run both the server-side tests (located in the app/tests/ directory) and the client-side tests (located in the public/modules/*/tests/).

To execute only the server tests, run the test:server task:

```bash
$ grunt test:server
```

And to run only the client tests, run the test:client task:

```bash
$ grunt test:client
```

## Running your application with Gulp

After the install process, you can easily run your project with:

```bash
$ gulp
```
or

```bash
$ gulp default
```

The server is now running on http://localhost:3000 if you are using the default settings. 

### Running Gulp Development Environment

Start the development environment with:

```bash
$ gulp dev
```

### Running in Production mode
To run your application with *production* environment configuration, execute gulp as follows:

```bash
$ gulp prod
```

### Testing Your Application with Gulp
Using the full test suite included with Locatory with the test task:

### Run all tests
```bash
$ gulp test
```

### Run server tests
```bash
gulp test:server
```

### Run client tests
```bash
gulp test:client
```

### Run e2e tests
```bash
gulp test:e2e
```

## Development and deployment With Docker

* Install [Docker](https://docs.docker.com/installation/#installation)
* Install [Compose](https://docs.docker.com/compose/install/)

* Local development and testing with compose:
```bash
$ docker-compose up
```

* Local development and testing with just Docker:
```bash
$ docker build -t locatory .
$ docker run -p 27017:27017 -d --name db mongo
$ docker run -p 3000:3000 --link db:db_1 locatory
$
```

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.