var resetPasswordForm = document.getElementById('addform')
var passwordMatch = document.getElementById('success-message')
var passwordNotMatch = document.getElementById('error-message')

resetPasswordForm.addEventListener('submit', resetPassword)

function resetPassword(e) {
    e.preventDefault()
    var newPassword = document.getElementById('new-password').value
    var confirmPassword = document.getElementById('confirm-password').value

    var resetPasswordDetails = {
        newpassword: newPassword, 
        confirmpassword: confirmPassword
    }

    if (newPassword === confirmPassword) {
        passwordMatch.textContent = 'Password Match!'
        // Extracting token from the URL
        var resetToken = window.location.pathname.split('/').pop(); 
        
        axios.post(`http://localhost:3000/password/resetpassword/${resetToken}`, resetPasswordDetails)
            .then((response) => {
                console.log(response);
                alert('Your password has been reset Successfully!')
            })
            .catch((err) => {
                alert('Your reset Password link is been Expired!')
                passwordNotMatch.textContent = "If you want to reset the password again then send the link to your mail again by clicking on forgot password!"
                console.log('Error:', err.response);
            });
    } else {
        passwordNotMatch.textContent = "Password Doesn't Match!"
    }
}