const express = require('express');
const path = require('path');

const axios = require('axios');

var app = express();

// Require the body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set port app will run on
app.set('port', process.env.PORT || 3001);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async function(req, res) {
	res.render('home', {
		stores: (await getStores(req.query))
	});
});

function getStores(query) {
	axios.defaults.headers.common['x-api-key'] = "test";
	let url = `http://localhost:3000/search/items?q=${query.q}&zip=${query.zipcode}&radius=${query.radius}&city=${query.city}&state=${query.state}`;

	return axios.get(url)
		.then(function (response) {	
		  return response.data.data;	
		})	
		.catch(function (error) {
		  // handle error	
		  console.log(error);	
		  return [];  // safe value	
		});
}

// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
  console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
});
