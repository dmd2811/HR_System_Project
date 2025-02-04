create database db_hrmanager;
use db_hrmanager;

CREATE TABLE tb_employees ( -- thông tin nhân viên 
    employee_id int auto_increment primary key,
    name VARCHAR(255),
    department VARCHAR(255),
    position VARCHAR(255),
    base_salary INT
)AUTO_INCREMENT = 1000;
insert into tb_employees(name, department, position, base_salary)
values("ADMIN", null, null, null);
delete from tb_employees where employee_id = 1000;

create table tb_timesheets ( -- thông tin chấm công
	timesheet_id serial	primary key,
    employee_id int,
    foreign key (employee_id) references tb_employees(employee_id),
    days date,
    check_in timestamp,
    check_out timestamp,
    hours_worked float
);
insert into tb_timesheets(employee_id, days, check_in, check_out, hours_worked)
values(1009, '2025-02-03', "2025-02-03T08:00:00", "2025-02-03T17:00:00", 8.00);

select *, ROUND(TIMESTAMPDIFF(SECOND, check_in, check_out) / 3600.0, 2) as calculated 
from tb_timesheets;



create table tb_users ( -- thông tin tài khoản người dùng
    username varchar(255) primary key,
    password varchar(255),
    role enum("admin", "employee"),
    employee_id int,
    foreign key (employee_id) references tb_employees(employee_id)
);
delete from tb_users where employee_id = 1000;

SET SQL_SAFE_UPDATES = 0;
select* from tb_employees;
select* from tb_timesheets;
select* from tb_users;


drop table tb_employees;
drop table tb_timesheets;
drop table tb_users;

delete from tb_users where username = "it_admin";
delete from tb_timesheets where id = 6;
delete from tb_employees where id = 24;

update tb_employees set department = null, position = null , base_salary = null where employee_id = 1000;