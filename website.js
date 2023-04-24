let loggedUser;
let shootKey;
window.addEventListener("load", init, false);


function init(){
  showScreen("welcome-screen");

  const inputField = document.getElementById('shoot-key');

  inputField.addEventListener('keydown', event => {
    shootKey = event.keyCode || event.which;
  });
  const modal = document.getElementById("modal");
  const openBtn = document.getElementById("open-modal");
  const closeBtn = document.getElementsByClassName("close")[0];

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal when user clicks on close button
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when user clicks outside the modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Close modal when user presses the escape key
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      modal.style.display = "none";
    }
  });

    const newGameButton = document.querySelector('.new-game-button');

    newGameButton.addEventListener('click', () => {
    // Perform button click action here

    // Remove focus from the button
    newGameButton.blur();
    });
}

function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(screen => {
    if (screen.id === screenId) {
      if (screenId == "register-screen" || screenId == "welcome-screen" || screenId=="configuration-screen" || screenId=="end-screen" || screenId=="login-screen"){
        screen.style.display = "flex";
      }

      else{
        screen.style.display = "block";
      }
      
    } else {
      screen.style.display = "none";
    }
    if (screenId == "game-screen"){
      document.getElementById('footer').style.display = "none";
      document.getElementById('body').classList = "container-column body-game"
    }
    else{
        document.getElementById('footer').style.display = "block";
        document.getElementById('body').classList = "container-column body"
    }
  });
}

function validateRegistrationForm() {
    let user = {
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: ""
      };
    var username = document.forms["registrationForm"]["username"].value;
    var password = document.forms["registrationForm"]["password"].value;
    var passwordVerify = document.forms["registrationForm"]["passwordVerify"].value;
    var firstName = document.forms["registrationForm"]["firstName"].value;
    var lastName = document.forms["registrationForm"]["lastName"].value;
    var email = document.forms["registrationForm"]["email"].value;
    var dateOfBirth = document.forms["registrationForm"]["dateOfBirth"].value;
  
    console.log("p1:" , password)
    console.log("p2:" , passwordVerify)
    // Check that all fields are filled
    if (username == "" || password == "" || passwordVerify == "" || firstName == "" || lastName == "" || email == "" || dateOfBirth == "") {
      alert("All fields must be filled out");
      return;
    }
  
    // Check that password has at least 8 characters and includes letters and numbers
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters long and include both letters and numbers");
      return;
    }
  
    // Check that first name and last name only include letters
    var nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      alert("First name and last name may only include letters");
      return;
    }
  
    // Check that email is valid
    var emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address");
      return;
    }
  
    // Check that password and password verification fields match
    if (password != passwordVerify) {
      alert("Password and password verification do not match");
      return;
    }
  
    // Check that birthday is not in the future
    var today = new Date();
    var birthdayDate = new Date(dateOfBirth);
    if (birthdayDate > today) {
      alert("Birthday must be in the past");
      return;
    }

    let userDataJson = localStorage.getItem(username);
    if (userDataJson != null){
      alert("This username is already taken!");
      return;
    }
  
    user.username = username;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.dateOfBirth = dateOfBirth;

    // Create a JSON object with the username as the key and the user object as the value
    let userData = {};
    userData[user.username] = user;

    // Use JavaScript to write the JSON object to a file
    // Convert the user object to a JSON string
    let userJson = JSON.stringify(user);

    // Save the JSON string to local storage
    localStorage.setItem(user.username, userJson);

    console.log("User data saved to local storage");

    showScreen('register-succeed-screen');
  }

function login(){

  let username = document.forms["loginForm"]["username"].value;
  let password = document.forms["loginForm"]["password"].value;

  // Retrieve the user data from local storage using the username as the key
  let userDataJson = localStorage.getItem(username);

  console.log(userDataJson);
  if (userDataJson == null){
    alert("Username doesn't exist!")
    return false;
  }
  // Parse the JSON string back into a JavaScript object
  let userData = JSON.parse(userDataJson);
  if (userData.password != password){
    alert("Wrong password!")
    return false;
  }
  loggedUser = userData;
  showScreen("configuration-screen");
  return false;
}