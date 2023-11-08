/* Jake Kravas
This file sends user-inputted data, such as user and item data
to server.js
*/

let userForm = document.getElementById('user-form');
let itemForm = document.getElementById('item-form');
let loginForm = document.getElementById('login-form');
let signupForm = document.getElementById('signup-form');

loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  let usernameVal = document.getElementById('login-username').value;
  let passwordVal = document.getElementById('login-password').value;

  console.log(usernameVal)
  console.log(passwordVal)

  // object to send to front-end
  const info = {
    username: usernameVal,
    password: passwordVal
  }

  // let checkCredentials = fetch(`/login/${usernameVal}/${passwordVal}`);

  // checkCredentials.then( (response) => {
  //   return response.json();

  // }).then((userObject) => {

  //   if (userObject) {
  //     console.log('valid')
  //     console.log(userObject)
  //     document.cookie = `username=${userObject.username}`;
  //   } else {
  //     console.log('invalid')
  //     document.cookie = `username=`;
  //   }

  // }).catch(() => { 
  //   alert('something went wrong');
  // });




  let post = fetch('/login', {
    method: 'POST',
    body: JSON.stringify(info),
    headers: { 'Content-Type': 'application/json'}
  });

  post.then(response => {
    return response.json();

  }).then((userObject) => {

    if (userObject) {
      console.log('valid')
      console.log(userObject)
      document.cookie = `username=${userObject.username}`;
      window.location.href = '/home.html';
    } else {
      console.log('invalid')
      document.cookie = `username=`;
      alert('Invalid credentials')
    }


  }).catch(() => { 
    alert('something went wrong');
  });

});



// Create and save user
signupForm.addEventListener('submit', function(e) {
  e.preventDefault();

  let usernameVal = document.getElementById('signup-username').value;
  let passwordVal = document.getElementById('signup-password').value;

  console.log(usernameVal)
  console.log(passwordVal)

   // if both username and password are not empty, send them to back-end
   if (usernameVal && passwordVal) {

    // object to send to front-end
    const info = {
      username: usernameVal,
      password: passwordVal
    }

    let post = fetch('/add/user', {
      method: 'POST',
      body: JSON.stringify(info),
      headers: { 'Content-Type': 'application/json'}
    });

    post.then(response => {

      document.getElementById('signup-username').value = '';
      document.getElementById('signup-password').value = '';
      return response.json();
      // console.log(response)
      // return response.json()
      // console.log(response.text())

    }).then((res) => {
      console.log(res.text)
      alert(res.text)
    }).catch(() => {
      console.log('Something went wrong')
    });
  }
});
