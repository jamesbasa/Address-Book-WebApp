const express = require( 'express' );
const address = require('./controllers/address/index.js');
const crud = require( './controllers/address/index.js');

const app = express();
// parse incoming requests with JSON payloads
app.use(express.json());

var allowCrossDomain = function(req, res, next) {
  // necessary to allow local client to send API requests
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);

// Routing is how app endpoints (URIs) respond to client requests.
// The following Express functions correspond to HTTP requests

/**
 * GET Request - gets all addresses
 */
app.get( '/addresses', async ( req, res ) => {
  var addresses = await crud.getAll();
  
  if (addresses === undefined || addresses.length == 0) {
    // output nothing if no addresses were found
    addresses = {};
  }

  res.status(200).send(JSON.stringify({
    addresses
  }, null, 4));
});

/**
 * GET Request - gets the specified id's address
 */
app.get( '/addresses/:id', async ( req, res ) => {
  const id = req.params.id;
  const address = await crud.get(id);

  // address was not found
  if (!address) {
    res.status(404).send(JSON.stringify({
      'error': {
        "message": "address not found",
        "status_code": 404,
        "code": "not_found"
      }
    }, null, 4));
  }
  // address was found
  else {
    res.status(200).send(JSON.stringify(
      address
    , null, 4));
  }
});

/**
 * POST Request - adds a new address
 */
app.post( '/addresses', async ( req, res ) => {
  const address = req.body;
  const line1 = address.line1;
  const line2 = address.line2;
  const city = address.city;
  const state = address.state;
  const zip = address.zip;
  const id = await crud.add(address);

  // address could not be added
  if (!id) {
    res.status(422).send(JSON.stringify({
      'error': {
        "message": "line1, city, state (2 letters), and zip (5 digits) are required",
        "status_code": 422,
        "code": "invalid"
      }
    }, null, 4));
  }
  // address was added
  else {
    res.status(200).send(JSON.stringify({
      'id': id,
      'line1': line1,
      'line2': line2,
      'city': city,
      'state': state,
      'zip': zip
    }, null, 4));
  }
});

/**
 * PUT Request - edits the specified id's address
 */
app.put( '/addresses/:id', async ( req, res ) => {
  var id = req.params.id;
  const newAddress = req.body;
  const line1 = newAddress.line1;
  const line2 = newAddress.line2;
  const city = newAddress.city;
  const state = newAddress.state;
  const zip = newAddress.zip;
  id = await crud.update(id, newAddress);

  // id was not be found
  if (!id) {
    res.status(404).send(JSON.stringify({
      'error': {
        "message": "id not found",
        "status_code": 404,
        "code": "not_found"
      }
    }, null, 4));
  }
  // address could not be edited
  else if (id == -1) {
    res.status(422).send(JSON.stringify({
      'error': {
        "message": "line1, city, state (2 letters), and zip (5 digits) are required",
        "status_code": 422,
        "code": "invalid"
      }
    }, null, 4));
  }
  // address was edited
  else {
    res.status(200).send(JSON.stringify({
      'id': id,
      'line1': line1,
      'line2': line2,
      'city': city,
      'state': state,
      'zip': zip
    }, null, 4));
  }
});

/**
 * DELETE Request - deletes the specified id's address
 */
app.delete('/addresses/:id', async (req, res) => {
  const id = req.params.id;
  var deleted = false;
  if (await crud.delete(id) > 0) deleted = true;

  // address was not deleted
  if (!deleted) {
    await res.status(404).send(JSON.stringify({
      'error': {
        "message": "address not found",
        "status_code": 404,
        "code": "not_found"
      }
    }, null, 4));
  }
  // address was deleted
  else {
    await res.status(200).send(JSON.stringify({
      'id': id,
      'deleted': deleted
    }, null, 4));
  }
});

/**
 * POST Request - searches for an address substring
 */
app.post( '/addresses/search', async ( req, res ) => {
  const searchString = req.body.searchInput;
  const searchResult = await crud.search(searchString);
  //console.log('search result: ', searchResult);

  // no addresses contain this search string
  if (searchResult == undefined || searchResult == null || searchResult.length == 0) {
    res.status(404).send(JSON.stringify({
      'error': {
        "message": "address not found",
        "status_code": 404,
        "code": "not_found"
      }
    }, null, 4));
  }
  // address was matched
  else {
    res.status(200).send(JSON.stringify({
      searchResult
    }, null, 4));
  }
});

app.listen( process.env.PORT );
