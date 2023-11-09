/* Jake Kravas
This file sends user-inputted item data to the
back end and saves it as a new item
*/


// if not logged in, redirect to login page
if (!document.cookie.split('username=')[1]) {
  window.location.href = '/';
}

let itemForm = document.getElementById('item-form');
let logoutBtn = document.getElementById('logout-btn');

// Create and save item
itemForm.addEventListener('submit', function(e) {
  e.preventDefault();

  
  let titleVal = document.getElementById('title-input').value;
  let descriptionVal = document.getElementById('description-input').value;
  let imageVal = document.getElementById('image-input').value;
  let priceVal = document.getElementById('price-input').value;
  let statusVal = document.getElementById('status-input').value;
  let usernameVal = document.cookie.split('username=')[1];


   // if all required fields are filled out, send them to back-end
   if (titleVal && descriptionVal && priceVal && usernameVal) {
    // object to send to front-end
    const info = {
      title: titleVal,
      description: descriptionVal,
      image: imageVal,
      price: priceVal,
      status: statusVal
    }

    let post = fetch(`/add/item/${usernameVal}`, {
      method: 'POST',
      body: JSON.stringify(info),
      headers: { 'Content-Type': 'application/json'}
    });

    post.then((response) => {
      response.text();
      console.log('done')
    }).then((text) => {
      console.log(text)
      window.location.href = '/home.html';
    }).catch(() => {
      console.log('Something went wrong')
    });;
  }

});


// clear username cookie and redirect to login page
logoutBtn.addEventListener('click', function(e) {
  e.preventDefault();
  
  document.cookie = `username=`;
  window.location.href = '/';
});