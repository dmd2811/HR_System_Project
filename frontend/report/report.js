document.addEventListener("DOMContentLoaded", employees)
function employees(event){

    const accessToken = localStorage.getItem("accessToken")
    if (accessToken){
        console.log("Welcome Report")
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


bt_show = document.querySelector(".bt-show")
bt_show.addEventListener("click", click_Show)
function click_Show(event){
    event.preventDefault();

    const month = document.getElementById('month-select').value.trim();
    const year = document.getElementById('year-select').value.trim();
    
    // In ra các giá trị để kiểm tra
    
    console.log("Tháng:", `"${month}"`);
    console.log("Năm:", `"${year}"`);

    fetch("http://127.0.0.1:5000/api/report",{
        method: "POST",
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({month, year}),
    })
        .then(response => response.json())
        .then(data =>{
            if(Array.isArray(data) && data.length == 0){
                console.log("rong")
                const tableBody = document.querySelector(".report-table tbody")
                tableBody.innerHTML = ""
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                    <td>---</td>
                `;
                tableBody.append(row)
            }
            else{
                console.log(data)
                const tableBody = document.querySelector(".report-table tbody")
                tableBody.innerHTML = ""
                data.forEach(infor_report => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${infor_report.employee_id}</td>
                        <td>${infor_report.name}</td>
                        <td>${infor_report.total_working_day}</td>
                        <td>${infor_report.total_salary}</td>
                    `;
                    tableBody.append(row)
                });
            }   
        })
        .catch(error => {
            alert(data.error)
        })
}

