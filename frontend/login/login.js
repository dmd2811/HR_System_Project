function login(event){
    event.preventDefault()
    username = document.getElementById("username").value
    password = document.getElementById("password").value
    
    fetch("http://127.0.0.1:5000/api/login",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username,password}),
    })
        .then(response => response.json())
        .then(data =>{
            if(data.accessToken){
                localStorage.setItem("accessToken",data.accessToken)
                window.location.href = "../homepage/homepage.html"
            }
            else{
                alert(data.error)
            }   
        })
        .catch(error => {
            alert(data.error)
        })
}

document.getElementById("loginForm").addEventListener("submit", login)

