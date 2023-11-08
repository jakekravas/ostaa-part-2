let itemForm = document.getElementById('item-form');

// Create and save item
itemForm.addEventListener('submit', function(e) {
  e.preventDefault();

  let titleVal = document.getElementById('title-input').value;
  let descriptionVal = document.getElementById('description-input').value;
  let imageVal = document.getElementById('image-input').value;
  let priceVal = document.getElementById('price-input').value;
  let statusVal = document.getElementById('status-input').value;
  let usernameVal = document.getElementById('username-item-input').value;

   // if all required fields are filled out, send them to back-end
   if (titleVal && descriptionVal && imageVal && priceVal && usernameVal) {
    console.log('if hit')
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
      // window.location.href = 'http://127.0.0.1:8080/get/users';
      // loadAllUsers();
    }).then((text) => {
      console.log(text)
    });
  }

});