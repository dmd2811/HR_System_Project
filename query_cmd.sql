create database db_database;
use db_database;
SELECT VERSION();

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
insert into tb_timesheets(employee_id, days, check_in, check_out)
values(1009, '2025-02-03', "2025-02-03T08:00:00", "2025-02-03T17:00:00");

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
select * from seq_0_to_31;


drop table tb_employees;
drop table tb_timesheets;
drop table tb_users;

delete from tb_users where username = "it_admin";
delete from tb_timesheets where id = 6;
delete from tb_employees where id = 24;

update tb_employees set department = null, position = null , base_salary = null where employee_id = 1000;


-- Bước 1: Tạo bảng seq_0_to_31 (nếu chưa tồn tại)
CREATE TABLE IF NOT EXISTS seq_0_to_31 (
    seq INT
);

-- Chèn các giá trị từ 0 đến 31 vào bảng (nếu chưa có)
INSERT IGNORE INTO seq_0_to_31 (seq) VALUES
(0), (1), (2), (3), (4), (5), (6), (7), (8), (9),
(10), (11), (12), (13), (14), (15), (16), (17), (18), (19),
(20), (21), (22), (23), (24), (25), (26), (27), (28), (29),
(30), (31);

-- Khai báo biến @month và @year
SET @month = 2;  -- Thay đổi tháng bạn muốn tính toán
SET @year = 2025; -- Thay đổi năm bạn muốn tính toán

-- Bước 2: Tính toán số ngày công trong tháng
WITH MonthlyWorkingDays AS (
    SELECT
        DAY(LAST_DAY(CONCAT(@year, '-', @month, '-', '01'))) - (
            SELECT COUNT(*)
            FROM (
                SELECT CONCAT(@year, '-', @month, '-', '01') + INTERVAL seq DAY AS dt
                FROM seq_0_to_31
            ) AS dates
            WHERE DAYOFWEEK(dt) IN (1, 7) AND dt <= LAST_DAY(CONCAT(@year, '-', @month, '-', '01'))
        ) AS working_days_in_month
),
-- Bước 3: Tính toán tổng số phút làm việc trong ngày cho mỗi nhân viên
CalculatedTimesheets AS (
    SELECT
        employee_id,
        days,
        SUM(TIMESTAMPDIFF(MINUTE, check_in, check_out)) AS total_minutes_per_day
    FROM tb_timesheets
    WHERE MONTH(days) = @month AND YEAR(days) = @year  -- Lọc dữ liệu theo tháng và năm
    GROUP BY employee_id, days
    HAVING DAYOFWEEK(days) NOT IN (1, 7)
),
-- Bước 4: Tính tiền lương trên 1 phút cho mỗi nhân viên
SalaryPerMinute AS (
    SELECT
        e.employee_id,
        e.base_salary / mwd.working_days_in_month / 8 / 60 AS salary_per_minute
    FROM tb_employees e
    CROSS JOIN MonthlyWorkingDays mwd
)
-- Bước 5: Tính tổng lương cho mỗi nhân viên
SELECT
    cts.employee_id,
    e.name,
    ROUND(SUM(cts.total_minutes_per_day) / 60 / 8, 2) AS total_working_day,
    ROUND(spm.salary_per_minute * SUM(cts.total_minutes_per_day), 2) AS total_salary
FROM CalculatedTimesheets cts
JOIN SalaryPerMinute spm ON cts.employee_id = spm.employee_id
JOIN tb_employees e ON cts.employee_id = e.employee_id
GROUP BY cts.employee_id, e.name, spm.salary_per_minute;

