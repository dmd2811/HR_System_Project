document.addEventListener("DOMContentLoaded", employees)
function employees(event){

    const accessToken = localStorage.getItem("accessToken")
    if (accessToken){
        console.log("Welcome")
        const tableBody = document.querySelector(".employees-table tbody")
        tableBody.innerHTML = ""
        
        fetch("http://127.0.0.1:5000/api/employees",{
            method: "GET",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            },
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(employee => {
                console.log(data.message)
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${employee.employee_id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.department}</td>
                    <td>${employee.position}</td>
                    <td>${employee.base_salary}</td>
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
    modal_add = document.getElementById("addEmployeeModal")
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

    const name = document.getElementById('name').value.trim();
    const department = document.getElementById('department').value.trim();
    const position = document.getElementById('position').value.trim();
    const base_salary = document.getElementById('base_salary').value.trim();

    // In ra các giá trị để kiểm tra
    
    console.log("Tên nhân viên:", `"${name}"`);
    console.log("Phòng ban:", `"${department}"`);
    console.log("Chức vụ:", `"${position}"`);
    console.log("Lương:", `"${base_salary}"`);

    fetch("http://127.0.0.1:5000/api/employees",{
        method: "POST",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name,department, position, base_salary}),
    })
        .then(response => response.json())
        .then(data =>{
            if(data.message){
                console.log(data.message)
                addEmployeeModal.style.display = "none"
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

document.querySelector('.employees-table tbody').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('bt-delete')) {
        row = event.target.closest('tr')
        data = row.querySelectorAll('td')
        employee_id = data[0].innerHTML
        console.log("Delete employee_id:", employee_id)
        if (confirm("Bạn có chắc muốn Xoá nhân viên ID: " + employee_id + " không?") == false ) {
            return
        }
        console.log(`http://127.0.0.1:5000/api/employees/${employee_id}`)
        fetch(`http://127.0.0.1:5000/api/employees/${employee_id}`,{
            method: "DELETE",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({employee_id}),
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
        const employee_id = data[0].innerHTML
        const name = data[1].innerHTML
        const department = data[2].innerHTML
        const position = data[3].innerHTML
        const base_salary = data[4].innerHTML

        if (confirm("Bạn có chắc muốn Sửa nhân viên ID: " + employee_id + " không?") == false ) {
            return
        }
        modal_edit = document.getElementById("editEmployeeModal")
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

        document.getElementById("edit-name").value = name
        document.getElementById("edit-department").value = department
        document.getElementById("edit-position").value = position
        document.getElementById("edit-base_salary").value = base_salary
        console.log("Edit employee_id:",employee_id)
        console.log(`http://127.0.0.1:5000/api/employees/${employee_id}`)

        bt_submit_edit = document.querySelector(".bt-submit-edit")
        bt_submit_edit.addEventListener("click", (event) => click_submit_Edit(event, employee_id))
    }
});


function click_submit_Edit(event,employee_id){
    event.preventDefault();

    const name = document.getElementById('edit-name').value.trim();
    const department = document.getElementById('edit-department').value.trim();
    const position = document.getElementById('edit-position').value.trim();
    const base_salary = document.getElementById('edit-base_salary').value.trim();

    // In ra các giá trị để kiểm tra
    console.log("Mã:", `"${employee_id}"`);
    console.log("Tên nhân viên:", `"${name}"`);
    console.log("Phòng ban:", `"${department}"`);
    console.log("Chức vụ:", `"${position}"`);
    console.log("Lương:", `"${base_salary}"`);

    fetch(`http://127.0.0.1:5000/api/employees/${employee_id}`,{
        method: "PUT",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name,department, position, base_salary}),
    })
        .then(response => response.json())
        .then(data =>{
            if(data.message){
                console.log(data.message)
                addEmployeeModal.style.display = "none"
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