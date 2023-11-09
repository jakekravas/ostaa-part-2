/* Jake Kravas
This file sends user-inputted data, such as user and item data
to server.js
*/

let searchForm = document.getElementById('search-form');
let viewListingsBtn = document.getElementById('view-listings-btn');
let viewPurchasesBtn = document.getElementById('view-purchases-btn');
let logoutBtn = document.getElementById('logout-btn');

let username = document.cookie.split('username=')[1];

// if logged in, display name in header, otherwise, redirect to login page
if (username) {
  document.getElementById('welcome-header').innerText = `Welcome ${username}! What would you like to do?`;
} else {
  window.location.href = '/';
}


// clear username cookie and redirect to login page
logoutBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  document.cookie = `username=`;
  window.location.href = '/';
});


// Search listings
searchForm.addEventListener('submit', function(e) {
  e.preventDefault();

  let searchVal = document.getElementById('search-input').value;
  let fetchUrl;

  console.log(searchVal);

   // if search val is not empty, get items of search
   if (searchVal) {
    fetchUrl = `/search/items/${searchVal}`;
  // if search val is empty, get all items
  } else {
    fetchUrl = `/get/items`;
   }

    let searchListings = fetch(fetchUrl);

    searchListings.then(response => {

      return response.json();

    }).then((items) => {

    let resultsHTML = '';

    for (let i = 0; i < items.length; i++) {
      let statusHTML;

      if (items[i].stat == 'SALE') {
        statusHTML = `<button id="buy-btn-search-${i}" onclick='buyItem("${items[i]._id}", "buy-btn-search-${i}")' class='buy-btn'>Buy now</button>`;
      } else {
        statusHTML = '<p class="purchased-text">Item has been purchased.</p>';
      }

      resultsHTML += `
        <div class='item'>
          <h4 class='item-header'>${items[i].title}</h4>
          <p>${items[i].description}</p>
          <p>Price: ${items[i].price}</p>
          ${statusHTML} 
        </div>
      `;
    }

    document.getElementById('item-results').innerHTML = resultsHTML;
    document.getElementById('results-header').textContent = 'Search results:';
    
  }).catch(() => {
    console.log('Something went wrong')
  });
});

// view listings of logged-in user
viewListingsBtn.addEventListener('click', function(e) {
  e.preventDefault();

  console.log(document.cookie)

  let username = document.cookie.split('username=')[1];

  let searchListings = fetch(`/get/listings/${username}`);

  searchListings.then(response => {

    return response.json();

  }).then((items) => {

    let resultsHTML = '';

    // for each item, create appropriate HTML and add it to DOM
    for (let i = 0; i < items.length; i++) {
      let statusHTML;

      if (items[i].stat == 'SALE') {
        // statusHTML = "<button  onclick='buyItem()' class='buy-btn'>Buy now</button>";
        statusHTML = `<button id="buy-btn-search-${i}" onclick='buyItem("${items[i]._id}", "buy-btn-search-${i}")' class='buy-btn'>Buy now</button>`;
      } else {
        statusHTML = '<p class="purchased-text">Item has been purchased.</p>';
      }

      resultsHTML += `
        <div class='item'>
          <h4 class='item-header'>${items[i].title}</h4>
          <p>${items[i].description}</p>
          <p>Price: ${items[i].price}</p>
          ${statusHTML} 
        </div>
      `;
    }

    document.getElementById('item-results').innerHTML = resultsHTML;
    document.getElementById('results-header').textContent = 'Your listings:';
    
  }).catch(() => {
    console.log('Something went wrong')
  });

});


// view purchases of logged-in user
viewPurchasesBtn.addEventListener('click', function(e) {
  e.preventDefault();

  console.log(document.cookie)

  let username = document.cookie.split('username=')[1];

  let searchPurchases = fetch(`/get/purchases/${username}`);

  searchPurchases.then(response => {

    return response.json();

  }).then((items) => {

    let resultsHTML = '';

    // for each item, create appropriate HTML and add it to DOM
    for (let i = 0; i < items.length; i++) {
      resultsHTML += `
        <div class='item'>
          <h4 class='item-header'>${items[i].title}</h4>
          <p>${items[i].description}</p>
          <p>Price: ${items[i].price}</p>
          <p class="purchased-text">Item has been purchased.</p>
        </div>
      `;
    }

    document.getElementById('item-results').innerHTML = resultsHTML;
    document.getElementById('results-header').textContent = 'Your purchases:';
    
  }).catch(() => {
    console.log('Something went wrong')
  });
});

// purchase item
function buyItem(itemId, buttonId) {
  console.log(itemId)
  console.log(buttonId)

  let btn = document.getElementById(buttonId);
  btn.disabled = true;

  const info = {
    username: username,
    itemId, itemId
  };

  let post = fetch('/buy', {
    method: 'POST',
    body: JSON.stringify(info),
    headers: { 'Content-Type': 'application/json'}
  });

  post.then(response => {
    return response.json();

  }).then((userObject) => {
    btn.textContent = 'SOLD';
    console.log(userObject)

  }).catch(() => { 
    alert('something went wrong');
  });
}
