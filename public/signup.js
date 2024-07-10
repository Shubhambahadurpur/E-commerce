
document.getElementById("password").addEventListener('keyup', () => {
    let passValue = document.getElementById("password").value;
    let upperCase = /[A-Z]/;
    let lowerCase = /[a-z]/;
    let oneNumber = /[0-9]/;
    let minimumLength = /^.{8,}$/;
    if (upperCase.test(passValue)) {
        document.getElementById("upper-case").style.color = "green";
    }
    else {
        document.getElementById("upper-case").style.color = "rgb(255, 60, 60)";
    }

    if (lowerCase.test(passValue)) {
        document.getElementById("lower-case").style.color = "green";
    }
    else {
        document.getElementById("lower-case").style.color = "rgb(255, 60, 60)";
    }

    if (oneNumber.test(passValue)) {
        document.getElementById("oneNumber").style.color = "green";
    }
    else {
        document.getElementById("oneNumber").style.color = "rgb(255, 60, 60)";
    }
    if (minimumLength.test(passValue)) {
        document.getElementById("length").style.color = "green";
    }
    else {
        document.getElementById("length").style.color = "rgb(255, 60, 60)";
    }

})

let username = document.getElementById('email');
document.getElementById('btn').addEventListener("click", () => {
    let password = document.getElementById('password');
    const pattern = /^[A-Za-z0-9]{3,}@[A-Za-z]{2,10}.[A-Za-z]{2,4}$/;
    // const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    let message = document.getElementById("message");
    if (username.value === "") {
        alert("E-mail/password is empty");
    }
    else {
        
        if (pattern.test(username.value) && passwordPattern.test(password.value)) {
            let data = {
                username: username.value,
                password: password.value,
                is_verify: false,
                role:0
            };
            let opt = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };

            fetch("/signup", opt).then(response =>
                response.json()).then((response) => {
                    console.log(response);
                    message.innerText = response;
                })
        }
        else if (pattern.test(username.value) && !passwordPattern.test(password.value)) {
            message.innerText = "password not valid";
        }
        else{
            message.innerText = "Email not valid";
        }
       
    }
})

