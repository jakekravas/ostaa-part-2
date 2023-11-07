/* Jake Kravas
This file sends user-inputted data, such as user and item data
to server.js
*/

let userForm = document.getElementById('user-form');
let itemForm = document.getElementById('item-form');
let loginForm = document.getElementById('login-form');
let signupForm = document.getElementById('signup-form');
let searchForm = document.getElementById('search-form');


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
        resultsHTML += `
          <div class='item'>
            <h4>${items[i].title}</h4>
            <p>${items[i].description}</p>
            <button class='buy-btn'>Buy now</button>
          </div>
        `;
      }

      document.getElementById('results-area').innerHTML = resultsHTML;
      
    }).catch(() => {
      console.log('Something went wrong')
    });
  }
});
