document.getElementById('btn').addEventListener("click", async () => {
    let username = document.getElementById('email');
    let password = document.getElementById('password');
    let pattern = /^[A-Za-z0-9]{3,}@[A-Za-z]{2,10}.[A-Za-z]{2,3}$/;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (pattern.test(username.value) && passwordPattern.test(password.value)) {

        let data = {
            username: username.value,
            password: password.value,
        };
        let opt = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        const response = await fetch("/login", opt);
        const responseObj = await response.json();
        console.log(responseObj.status);
        if (responseObj.status === 200) {
            window.location.href = "/";
        }
        else {
            document.getElementById('message').innerText = responseObj;
        }

    }
    else if (pattern.test(username.value) && !passwordPattern.test(password.value)) {
        message.innerText = "password not valid";
    }
    else {
        document.getElementById('message').innerText = "Email is not Valid";
    }

})



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


async function forgotPassword(){
    let message = document.getElementById('message');
    document.body.innerHTML = `<div class="login">
                                         <h1>Forgot Password?</h1>
                                         <div class="inputs">
                                             <label for="email">Email<input type="text" placeholder="Email" name="email" id="email" required/></label>
                                             <h5>Enter the registered e-mail</h5>
                                         </div>
                                         <button class="signup-btn" id="forgotpassword">Send Link</button>
                                         <div id="message"></div>
                                     </div>`;

                document.getElementById("forgotpassword").addEventListener("click",async ()=>{
                                     console.log("hi");
                        let email = document.getElementById('email');
                        let pattern = /^[A-Za-z0-9]{3,}@[A-Za-z]{2,10}.[A-Za-z]{2,3}$/;
                        if(pattern.test(email.value)){
                                let data = {
                                    username:email.value
                                }
                                let opt = {
                                    method:'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data),
                                }

                            let response = await fetch('/forgotpassword',opt);
                            let responseObj = await response.json();
                            message.innerText = responseObj;
                        }
                        else{
                            message.innerText = "Email not Valid";
                        }
                    })   
   
}
