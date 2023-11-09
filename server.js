/* Jake Kravas
This file receives data from the front end,
adds users and items to the database,
updates status of items,
searches for items
*/

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const bp = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Database stuff
const MONGODB_URL = 'mongodb+srv://jake:cmXhjrj9ZzDRlmHz@cluster0.pd6qpel.mongodb.net/?retryWrites=true&w=majority';

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  stat: String
});

let UserSchema = new Schema({
  username: String,
  password: String,
  listings: [String],
  purchases: [String]
});

let Item = mongoose.model('item', ItemSchema );
let User = mongoose.model('user', UserSchema );

// Starts database
const db = async() => {
  try {
    const con = await mongoose.connect(MONGODB_URL);
    console.log('Database Connected');
  } catch (err) {
    console.log(err)
  }
}

db()

app.use(express.static('/assets'), express.static(__dirname + '/public_html'));
app.use(cookieParser());
app.use(bp.json());
app.use(cors());

// Starts app
app.listen(port, () =>
  console.log(`App listening at http://127.0.0.1:${port}`)
);

// get all users
app.get('/get/users', async function(req, res) {
  let users = await User.find({});
  let usersObj = JSON.stringify(users);
  
  res.end(usersObj);
});

// get all items
app.get('/get/items', async function(req, res) {
  let items = await Item.find({});
  let itemsObj = JSON.stringify(items);
  
  res.end(itemsObj);
});

// get all listings of given user
app.get('/get/listings/:username', async function(req, res) {
  let user = await User.findOne({username: req.params.username.toLowerCase()});
  let userListingIDs = user.listings;
  let userListings = [];

  // for each item id in userListingIDs, retrieve that item from database and push to userListings
  for (let i = 0; i < userListingIDs.length; i++) {
    let item = await Item.findById(userListingIDs[i]);
    if (item) {
      userListings.push(item);
    }
  }

  let listingsObj = JSON.stringify(userListings);
  
  res.end(listingsObj);
});

// get all purchases of given user
app.get('/get/purchases/:username', async function(req, res) {
  let user = await User.findOne({username: req.params.username.toLowerCase()});
  let userPurchasesIDs = user.purchases;
  let userPurchases = [];

  // for each item id in userPurchasesIDs, retrieve that item from database and push to userPurchases
  for (let i = 0; i < userPurchasesIDs.length; i++) {
    let item = await Item.findById(userPurchasesIDs[i]);
    if (item) {
      userPurchases.push(item);
    }
  }

  let purchasesObj = JSON.stringify(userPurchases);
  
  res.end(purchasesObj);
});


// get search results of users based on keyword
app.get('/search/users/:keyword', async function(req, res) {
  let users = await User.find({});

  let searchResults = [];

  // for each user, if the keyword is included in their username,
  // add it to searchResults
  for (let i = 0; i < users.length; i++) {
    if (users[i].username.includes(req.params.keyword)) {
      searchResults.push(users[i])
    }
  }

  let searchResultsStr = JSON.stringify(searchResults);
  
  res.end(searchResultsStr);
});

// get items based on keyword
app.get('/search/items/:keyword', async function(req, res) {
  let items = await Item.find({});

  let searchResults = [];

  // for each item, if the keyword is included in its description,
  // add it to searchResults
  for (let i = 0; i < items.length; i++) {
    if (items[i].description.toLowerCase().includes(req.params.keyword.toLowerCase())) {
      searchResults.push(items[i])
    }
  }

  let searchResultsStr = JSON.stringify(searchResults);
  
  res.end(searchResultsStr);
});


// Save new user
app.post('/add/user', async function(req, res) {
  let username = req.body.username.toLowerCase();
  let password = req.body.password;

  let newUser = new User({
    username: username,
    password: password,
    listings: [],
    purchases: []
  });

  let userExists = await User.findOne({username: username}).exec();

  if (userExists == null) {
    try {
      await newUser.save();
      // res.end('User saved successfully');
      res.end(JSON.stringify({text: 'User saved successfully'}));
    } catch (err) {
      return res.status(500).send('Failed to save user');
    }
  } else {
    console.log('already exists');
    // res.end('Username already exists');
    res.end(JSON.stringify({text: 'Username already exists'}));
  }
});

// Login user
app.post('/login', async function(req, res) {

  let username = req.body.username.toLowerCase();
  let password = req.body.password;

  console.log(username)
  console.log(password)

  // find user
  let foundUser = await User.findOne({username: username, password: password}).exec();

  console.log(foundUser)
    
  let usersObj = JSON.stringify(foundUser);

  console.log(res.cookie())
  console.log(res.req)
  console.log(res.req.cookies)


  res.send(usersObj);

});


// Save new item
app.post('/add/item/:username', async function(req, res) {

  let username = req.params.username.toLowerCase();
  let title = req.body.title;
  let description = req.body.description;
  let image = req.body.image;
  let price = req.body.price;
  let status = req.body.status;

  let newItem = new Item({
    title: title,
    description: description,
    image: image,
    price: price,
    stat: status
  });

  try {
    await newItem.save();
    console.log(newItem.id)

    let user = await User.findOne({username: username});

    // if status is "SALE", save item to user's listings
    if (status == 'SALE') {
      let newListings = user.listings;
      newListings.push(newItem.id);
  
      User.updateOne(
        { _id: user.id },
        { $set: {listings: newListings} }
      ).exec();

    // if status is "SOLD", save item to user's purchases
    } else if (status == 'SOLD') {

      let newPurchases = user.purchases;
      newPurchases.push(newItem.id);
  
      User.updateOne(
        { _id: user.id },
        { $set: {purchases: newPurchases} }
      ).exec();
    }

    // await newItem.save();
    return res.send('Item saved successfully');
  } catch (err) {
    return res.status(500).send('Failed to save item');
  }
});


// buy item. change it's stat from "SALE" to "SOLD"
app.post('/buy', async function(req, res) {
  let username = req.body.username;
  let itemId = req.body.itemId;

  console.log(username)
  console.log(itemId)

  try {

    let user = await User.findOne({ username: username });
    console.log(user)
    let userPurchases = user.purchases;
    userPurchases.push(itemId);

    await Item.updateOne(
      {_id: itemId},
      {$set : {stat: 'SOLD'}},
    ).exec();

    await User.updateOne(
      { username: username },
      { $set: {purchases: userPurchases} }
    ).exec();


    return res.send({text: 'Item purchased successfully'});
  } catch (err) {
    return res.status(500).send('Failed to purchase item');
  }
});
