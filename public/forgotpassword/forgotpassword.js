var form = document.getElementById('addForm')

form.addEventListener('submit', forgotPassword)

function forgotPassword(e) {
    e.preventDefault()

    var email = document.getElementById('email').value

    var forgotDetails = {
        emails: email
    }

    console.log(email)
    
    axios.post('http://localhost:3000/password/forgotpassword', forgotDetails)
        .then(response => {
            alert('Reset Password link is shared to your registered email!')
            console.log('Response', response) 
        })
        .catch(err => {
            console.log('Error:', err.response);
        });
}
