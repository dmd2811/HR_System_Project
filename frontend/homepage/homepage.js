bt_logout = document.querySelector(".bt-logout")
bt_logout.addEventListener("click", logout)
function logout(){
    alert("Logout account !")
    localStorage.clear()
    window.location.href = ("../login/login.html")
}

document.addEventListener("DOMContentLoaded", init)
function init(event){
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken){
        const payloadBase64 = accessToken.split('.')[1] // Lấy phần payload (phần giữa của JWT)
        const payloadDecoded = atob(payloadBase64) // Giải mã Base64
        const payloadObject = JSON.parse(payloadDecoded) // Chuyển thành Object
        console.log(payloadObject.sub)  // Lấy identity (username hoặc userID)

        document.querySelector(".user-infor h1").innerHTML = `Xin chào, ${payloadObject.sub}`

        fetch("http://127.0.0.1:5000/api/",{
            method: "GET",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            },
        })
        .then(response => response.json())
        .then(data => {
            if(data.message){
                console.log("live server")
            }
            else{
                window.location.href = ("../login/login.html")
            }
        })
        .catch(error =>{
            window.location.href = ("../login/login.html")
        })
    }
    else{
        window.location.href = ("../login/login.html")
    }
}

