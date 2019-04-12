JEDIMASTER

As a backend developer, I wrote this assignment in NodeJS environment.
I have craeted few REST API's which uses SWAPI API's internally. Below are the detail description of the assignment.
1. Created four REST APIs:
    a.  Endpoint: '/'
        Method: GET
    b.  Endpoint: '/home'
        Method: POST
    c.  Endpoint: '/welcome'
        Method: POST
    d.  Endpoint: '/searchPlanet'
        Method: POST

    At first, when your server is up and running, hit 'localhost:7000/', it will redirect you to the login dashboard. Once you enter your credentials it will authenticate and redirect you to the home page in success senerio.
    On the home page you are askd to enter the keyword to search and that will provide you all the planet details matched with that keyword.

2. Created four functions to fulfil this task:
    a.  getAllData() - This function will resolve the promise and return the details of all the existing startwar characters using swapi people api.

    b.  getAllPlanetData() - This function will resolve the promise and return the details of all the existing startwar planets using swapi planet api.

    c.  checkLogin() - This function will check your username and password and return true or false.

    d.  searchingPlanet() - This function will search for the planet object as per the keyword which you enter in the search bar.

Prerequisites:
1. Node
2. npm
3. Install all dependencies(npm-packages)---> [express, body-parser, swapi-node etc.].
	To install see below syntax:
	npm i <npm-package name>
4. Before hit the endpoints please make sure your server should be up and running. To run the server, copy below command on command prompt or gitbash, under the project directory:
	node app.js