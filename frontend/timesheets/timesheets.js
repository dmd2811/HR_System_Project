document.addEventListener("DOMContentLoaded", timesheets)
function timesheets(event){

    const accessToken = localStorage.getItem("accessToken")
    if (accessToken){
        console.log("Welcome")
        const tableBody = document.querySelector(".timesheets-table tbody")
        tableBody.innerHTML = ""
        
        fetch("http://127.0.0.1:5000/api/timesheets",{
            method: "GET",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            },
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(timesheet => {
                console.log(data.message)
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${timesheet.timesheet_id}</td>
                    <td>${timesheet.employee_id}</td>
                    <td>${timesheet.days}</td>
                    <td>${timesheet.check_in}</td>
                    <td>${timesheet.check_out}</td>
                    <td>${timesheet.hours_worked}</td>
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
    modal_add = document.getElementById("addTimesheetModal")
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

function convert_to_time(timestamp){
    date = new Date(timestamp)
    hours = date.getHours().toString().padStart(2, '0')
    minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
}
function convert_to_timestamp(days, time){
    return `${days} ${time}:00`
}

bt_submit_add = document.querySelector(".bt-submit-add")
bt_submit_add.addEventListener("click", click_submit_Add)
function click_submit_Add(event){
    event.preventDefault();
    console.log("submiting ...");
    const employee_id = document.getElementById('employee_id').value.trim();
    const days = document.getElementById('days').value.trim();
    check_in = document.getElementById('check_in').value.trim();
    check_out = document.getElementById('check_out').value.trim();

    check_in = convert_to_timestamp(days, check_in)
    check_out = convert_to_timestamp(days, check_out)   

    // In ra các giá trị để kiểm tra
    
    console.log("Mã nhân viên:", `"${employee_id}"`);
    console.log("Ngày:", `"${days}"`);
    console.log("Giờ vào:", check_in);
    console.log("Giờ ra:", check_out);

    fetch("http://127.0.0.1:5000/api/timesheets",{
        method: "POST",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({employee_id,days, check_in, check_out}),
    })
        .then(response => response.json())
        .then(data =>{
            if(data.message){
                console.log(data.message)
                addTimesheetModal.style.display = "none"
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

document.querySelector('.timesheets-table tbody').addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('bt-delete')) {
        row = event.target.closest('tr')
        data = row.querySelectorAll('td')
        timesheet_id = data[0].innerHTML
        console.log("Delete timesheet_id:", employee_id)
        if (confirm("Bạn có chắc muốn Xoá mã chấm công ID: " + timesheet_id + " không?") == false ) {
            return
        }
        console.log(`http://127.0.0.1:5000/api/timesheets/${timesheet_id}`)
        fetch(`http://127.0.0.1:5000/api/timesheets/${timesheet_id}`,{
            method: "DELETE",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({timesheet_id}),
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
        const timesheet_id = data[0].innerHTML
        const employee_id = data[1].innerHTML
        const days = data[2].innerHTML
        check_in = data[3].innerHTML
        check_out = data[4].innerHTML

        check_in = convert_to_time(check_in)
        check_out = convert_to_time(check_out)

        if (confirm("Bạn có chắc muốn Sửa mã chấm công ID: " + timesheet_id + " không?") == false ) {
            return
        }
        modal_edit = document.getElementById("editTimesheetModal")
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

        document.getElementById("edit-employee_id").value = employee_id
        document.getElementById("edit-days").value = days
        document.getElementById("edit-check_in").value = check_in
        document.getElementById("edit-check_out").value = check_out
        console.log("Edit timesheet_id:",timesheet_id)
        console.log(`http://127.0.0.1:5000/api/timesheets/${timesheet_id}`)

        bt_submit_edit = document.querySelector(".bt-submit-edit")
        bt_submit_edit.addEventListener("click", (event) => click_submit_Edit(event, timesheet_id))
        
    }
});

function click_submit_Edit(event,timesheet_id){
    event.preventDefault();

    const employee_id = document.getElementById('edit-employee_id').value.trim();
    const days = document.getElementById('edit-days').value.trim();
    check_in = document.getElementById('edit-check_in').value.trim();
    check_out = document.getElementById('edit-check_out').value.trim();

    check_in = convert_to_timestamp(days, check_in)
    check_out = convert_to_timestamp(days, check_out)
    // In ra các giá trị để kiểm tra
    console.log("Mã CC:", `"${timesheet_id}"`);
    console.log("Mã nhân viên:", `"${employee_id}"`);
    console.log("Ngày:", `"${days}"`);
    console.log("Giờ vào:", check_in);
    console.log("Giờ ra:", check_out);

    fetch(`http://127.0.0.1:5000/api/timesheets/${timesheet_id}`,{
        method: "PUT",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({employee_id,days, check_in, check_out}),
    })
        .then(response => response.json())
        .then(data =>{
            if(data.message){
                console.log(data.message)
                addTimesheetModal.style.display = "none"
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