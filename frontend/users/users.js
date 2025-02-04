document.addEventListener("DOMContentLoaded", users)
function users(event){

    const accessToken = localStorage.getItem("accessToken")
    if (accessToken){
        console.log("Welcome Users")
        const tableBody = document.querySelector(".users-table tbody")
        tableBody.innerHTML = ""
        
        fetch("http://127.0.0.1:5000/api/users",{
            method: "GET",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            },
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                console.log(data.message)
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td>${user.role}</td>
                    <td>${user.employee_id}</td>
                    <td>
                        <button class="bt bt-edit">Sửa</button>
                        <button class="bt bt-delete">Xoá</button>
                    </td>
                `;
                tableBody.append(row)
            });
        })
        .catch(error =>{
            window.location.href = ("../login/login.html")
        })
    }
    else{
        window.location.href = ("../login/login.html")
    }
}

bt_add = document.querySelector(".bt-add")
bt_add.addEventListener("click", click_Add)
function click_Add() {
    modal_add = document.getElementById("addUserModal")
    modal_add.style.display = "block"

    closeModalBtn.addEventListener("click", function() {
        modal_add.style.display = "none"; // Ẩn modal
    });

    // Đóng modal nếu người dùng click ra ngoài modal (không vào nội dung)
    window.addEventListener("click", function(event) {
        if (event.target === modal_add) {
            modal_add.style.display = "none"; // Ẩn modal
        }
    });

}

bt_submit_add = document.querySelector(".bt-submit-add")
bt_submit_add.addEventListener("click", click_submit_Add)
function click_submit_Add(event){
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value.trim();
    const employee_id = document.getElementById('employee_id').value.trim();

    // In ra các giá trị để kiểm tra
    
    console.log("Tên đăng nhập:", `"${username}"`);
    console.log("Mật khẩu:", `"${password}"`);
    console.log("Vai trò:", `"${role}"`);
    console.log("Mã sử dụng:", `"${employee_id}"`);

    fetch("http://127.0.0.1:5000/api/users",{
        method: "POST",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username,password, role, employee_id}),
    })
        .then(response => response.json())
        .then(data =>{
            if(data.message){
                console.log(data.message)
                addUserModal.style.display = "none"
                location.reload()
            }
            else{
                alert(data.error)
            }   
        })
        .catch(error => {
            alert(data.error)
        })
}

document.querySelector('.users-table tbody').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('bt-delete')) {
        row = event.target.closest('tr')
        data = row.querySelectorAll('td')
        username = data[0].innerHTML
        console.log("Delete username:", username)
        if (confirm("Bạn có chắc muốn Xoá người dùng: " + username + " không?") == false ) {
            return
        }
        console.log(`http://127.0.0.1:5000/api/users/${username}`)
        fetch(`http://127.0.0.1:5000/api/users/${username}`,{
            method: "DELETE",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username}),
        })
            .then(response => response.json())
            .then(data =>{
                if(data.message){
                    console.log(data.message)
                    location.reload()
                }
                else{
                    alert(data.error)
                }   
            })
            .catch(error => {
                alert(data.error)
            })
    }
    else if (event.target && event.target.classList.contains('bt-edit')) {
        
        row = event.target.closest('tr')
        data = row.querySelectorAll('td')
        const username = data[0].innerHTML
        const password = data[1].innerHTML
        const role = data[2].innerHTML
        const employee_id = data[3].innerHTML

        if (confirm("Bạn có chắc muốn Sửa người dùng: " + username + " không?") == false ) {
            return
        }
        modal_edit = document.getElementById("editUserModal")
        modal_edit.style.display = "block"
        closeEditModalBtn.addEventListener("click", function() {
            modal_edit.style.display = "none"; // Ẩn modal
        });

        // Đóng modal nếu người dùng click ra ngoài modal (không vào nội dung)
        window.addEventListener("click", function(event) {
            if (event.target === modal_edit) {
                modal_edit.style.display = "none"; // Ẩn modal
            }
        });

        document.getElementById("edit-username").value = username
        document.getElementById("edit-password").value = username
        document.getElementById("edit-role").value = role
        document.getElementById("edit-employee_id").value = employee_id
        console.log("Edit username:",username)
        console.log(`http://127.0.0.1:5000/api/users/${username}`)

        bt_submit_edit = document.querySelector(".bt-submit-edit")
        bt_submit_edit.addEventListener("click", (event) => click_submit_Edit(event, username))
    }
});


function click_submit_Edit(event,username){
    event.preventDefault();

    const password = document.getElementById('edit-password').value.trim();
    const role = document.getElementById('edit-role').value.trim();
    const employee_id = document.getElementById('edit-employee_id').value.trim();

    // In ra các giá trị để kiểm tra
    console.log("Tên đăng nhập:", `"${username}"`);
    console.log("Mật khẩu:", `"${password}"`);
    console.log("Vai trò:", `"${role}"`);
    console.log("Mã sử dụng:", `"${employee_id}"`);

    fetch(`http://127.0.0.1:5000/api/users/${username}`,{
        method: "PUT",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username,password, role, employee_id}),
    })
        .then(response => response.json())
        .then(data =>{
            if(data.message){
                console.log(data.message)
                addUserModal.style.display = "none"
                location.reload()
            }
            else{
                alert(data.error)
            }   
        })
        .catch(error => {
            alert(data.error)
        })
}