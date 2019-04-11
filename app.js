const express = require('express');
const app = express();
const swapi = require('swapi-node');
const bodyParser = require('body-parser');
const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
//app.use(cors);

app.get('/', (req, res) => {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        "<form method='post' action='/home'>" +
        "User Name : <input type='text' name='user_name' value=''/><br/><br/>" +
        "Password :<input type='password' name='birthYear' value=''/><br/><br/>" +
        "<input type='submit' value='Login'/><br/><br/>" +
        "</form>"
    );
})

app.post('/home', (req,res) => {
    console.log("Check login Request Triggered")
    if(!global.resultsData) {
        swapi.getPerson().then((result) => {
            let count =  result.count;
            let pages = Math.ceil(count/10);
            let eachPage = [];
            for(let i =1; i<=pages; i++){
                eachPage.push(i);
            }
            let allData = [];
            eachPage.filter(elem => allData.push(getAllData(elem)));
            Promise.all(allData)
            .then((result)=>{
                
                const modifedResult = result.reduce((accum, elem, index, origArr) => {
                    elem.results.filter((innerElem)=> {
                        accum.push({'name': innerElem.name, 'birth_year': innerElem.birth_year});
                    });
                    return accum;
                }, []);
                global.resultsData = modifedResult;
                console.log("Person initial data sync");
                const loginStatus = checkLogin(req.body.user_name, req.body.birthYear);
                if(loginStatus) {
                    res.writeHead(200, {'content-type': 'text/html'});
                    res.end("<form method='post' action='/searchPlanet'>" +
                    "Enter Planet Name : <input type='text' name='planet_name' value=''/><br/><br/>" +
                    "<input type='submit' value='Search'/><br/><br/>" +
                    "</form><br/><br/> " + "<div> Hello Bro </div>");
                    /*res.end("<script src='https://code.jquery.com/jquery-1.12.4.min.js'></script><form>" +
                    "Enter Planet Name : <input type='text' name='planet_name' value=''/><br/><br/>" +
                    "<input type='button' onclick= 'showPlanetData()' value='Search'/><br/><br/>" +
                    "</form>" + "<div id= 'planetResult'>  </div> <script> function showPlanetData() { $.ajax({url: 'localhost:7000/searchPlanet',type: 'get',success: function(data){console.log(data); for(var i = 0; i < data.length; i++) {var div = document.getElementById('planetResult'); div.innerHTML = data[i].name;} },error: function (xhr, ajaxOptions, thrownError) {var errorMsg = 'Ajax request failed: ' + xhr.responseText;$('#planetResult').html(errorMsg);}});};</script>");*/
                }
                else {
                    res.send("Invalid Credentials");
                }
                
            })
            .catch((err)=> {
                res.send(err);
            })
            // res.send(eachPage);
        })
        .catch((err)=>{
            res.send(err);
        })
    }
    else {
        console.log("Persons data exist")
        const loginStatus = checkLogin(req.body.user_name, req.body.birthYear);
        if(loginStatus) {
            res.writeHead(200, {'content-type': 'text/html'});
            res.end("<form method='post' action='/searchPlanet'>" +
                    "Enter Planet Name : <input type='text' name='planet_name' value=''/><br/><br/>" +
                    "<input type='submit' value='Search'/><br/><br/>" +
                    "</form><br/><br/> " + "<div> Hello Bro </div>");
        }
        else {
            res.send("Invalid Credentials");
        }
    }
})

app.post('/searchPlanet', (req, res) => {
    console.log("Search Planet Request Triggered")
    if(!global.planetResultsData){
        swapi.get(`https://swapi.co/api/planets/`)
        .then((planetResult) => {
            let planetCount =  planetResult.count;
            let planetPages = Math.ceil(planetCount/10);
            let planetEachPage = [];
            for(let i =1; i<=planetPages; i++){
                planetEachPage.push(i);
            }

            let allPlanetData = [];
            planetEachPage.filter(elem => allPlanetData.push(getAllPlanetData(elem)));
            Promise.all(allPlanetData)
            .then((planetResult)=>{
                global.planetResultsData = planetResult;
                console.log("Planet initial Data Sync");
                const searchedPlanets = searchingPlanet(req.body.planet_name);
                // res.writeHead(200, {'content-type': 'text/html'});
                // res.end("<form method='post' action='/home'>" +
                //     "Click here to search again<input type='submit' value='here'/><br/><br/>" + searchedPlanets);
                res.send(searchedPlanets);
            })
            .catch((err)=> {
                res.send(err);
            })
        })
        .catch((error) => {
            res.send(error);
        })
    }
    else {
        console.log('Planet data exist');
        const searchedPlanets = searchingPlanet(req.body.planet_name);
        res.send(searchedPlanets);
    }
})

function getAllData(pageNo){
    return new Promise ((resolve, reject)=> {
        swapi.get(`https://swapi.co/api/people/?page=${pageNo}`)
        .then((result) => {
            resolve(result)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function getAllPlanetData(pageNo){
    return new Promise ((resolve, reject)=> {
        swapi.get(`https://swapi.co/api/planets/?page=${pageNo}`)
        .then((result) => {
            resolve(result)
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

function checkLogin(userName, birthYear) {
    const loginIs = global.resultsData.some((userInfo) => {
        return userInfo.name == userName && userInfo.birth_year == birthYear;
    });
    console.log('loginIs',loginIs, userName, birthYear)
    return loginIs;
}

function searchingPlanet(planetName){
    let matchedPlanet = [];
    let re = new RegExp(planetName, 'gi');
    global.planetResultsData.filter((elem)=> {
        elem.results.filter((innerElem)=> {
            if(innerElem.name.toLowerCase().match(re)){
                matchedPlanet.push(innerElem);
            }
        })
    })
    if(matchedPlanet.length>0){
        return matchedPlanet;
    }
    else{
        return 'Search not found'
    }
    
}

let server = app.listen(7000, ()=>{
    console.log('Server is up and running on port 7000');
})

