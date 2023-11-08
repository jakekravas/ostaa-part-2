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

  console.log(searchVal);

   // if both username and password are not empty, send them to back-end
   if (searchVal) {

    let searchListings = fetch(`/search/items/${searchVal}`);

    searchListings.then(response => {

      return response.json();
      // console.log(response)
      // return response.json()
      // console.log(response.text())

    }).then((items) => {

      let resultsHTML = '';

      for (let i = 0; i < items.length; i++) {
        let statusHTML;

        if (items[i].stat == 'SALE') {
          // statusHTML = "<button  onclick='buyItem()' class='buy-btn'>Buy now</button>";
          // statusHTML = `<button onclick='buyItem("${items[i]._id}")' class='buy-btn'>Buy now</button>`;
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
  }
});


viewListingsBtn.addEventListener('click', function(e) {
  e.preventDefault();

  console.log(document.cookie)

  let username = document.cookie.split('username=')[1];

  let searchListings = fetch(`/get/listings/${username}`);

    searchListings.then(response => {

      return response.json();

    }).then((items) => {

      let resultsHTML = '';

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



viewPurchasesBtn.addEventListener('click', function(e) {
  e.preventDefault();

  console.log(document.cookie)

  let username = document.cookie.split('username=')[1];

  let searchPurchases = fetch(`/get/purchases/${username}`);

    searchPurchases.then(response => {

      return response.json();

    }).then((items) => {

      let resultsHTML = '';

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


function buyItem(itemId, buttonId) {
  console.log(itemId)
  console.log(buttonId)
  console.log('buy')

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