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
    }
    else{
        window.location.href = ("../login/login.html")
    }
}

