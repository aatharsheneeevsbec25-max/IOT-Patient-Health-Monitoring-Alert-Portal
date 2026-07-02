function login(){

    let email=document.getElementById("email").value;

    let password=document.getElementById("password").value;

    if(email=="" || password==""){

        alert("Please enter email and password");

        return;

    }

    alert("Login Successful");

    window.location.href="dashboard.html";

}
function register(){

    let name=document.getElementById("name").value;

    let age=document.getElementById("age").value;

    let email=document.getElementById("email").value;

    let password=document.getElementById("password").value;

    if(name=="" || age=="" || email=="" || password==""){

        alert("Please fill all fields");

        return;

    }

    alert("Registration Successful");

    window.location.href="login.html";

}