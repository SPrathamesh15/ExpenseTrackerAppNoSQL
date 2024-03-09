var addForm = document.getElementById('addform')
var errorMessageContainer = document.getElementById('error-message');
var successMessageContainer = document.getElementById('success-message');

addForm.addEventListener('submit', addUser)

function addUser(e) {
    e.preventDefault()
    var userName = document.getElementById('name').value;
    var userEmail = document.getElementById('email').value;
    var userPassword = document.getElementById('password').value;

    var userDetails = {
        username: userName,
        useremail: userEmail,
        userpassword: userPassword
    }
    console.log('consoling user data before posting', userDetails)
    axios.post('http://localhost:3000/user/add-user', userDetails)
    .then((response) => {
        console.log(response)
        alert('You have Signed Up Successfully! Now you can Log In')
        successMessageContainer.textContent = "User Signed Up Successfully!";
        window.location.href = '../login/login.html'
    })
    .catch(err => {
        errorMessageContainer.textContent = 'User Already Exists! You can Log In';
        console.log('user Already exists')
        console.log(err)})
}