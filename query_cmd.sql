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


drop table tb_employees;
drop table tb_timesheets;
drop table tb_users;

delete from tb_users where username = "it_admin";
delete from tb_timesheets where id = 6;
delete from tb_employees where id = 24;

update tb_employees set department = null, position = null , base_salary = null where employee_id = 1000;


-- Tính tổng thời gian làm việc của nhân viên trong tháng 2/2025
select *, TIMESTAMPDIFF(MINUTE, t.check_in, t.check_out) AS total_work_time_minutes
from tb_employees e
left join tb_timesheets t on e.employee_id = t.employee_id;


SELECT
    e.employee_id,  -- Chọn cột employee_id từ bảng e (tb_employees)
    e.name,  -- Chọn cột name từ bảng e
    SUM(TIMESTAMPDIFF(MINUTE, t.check_in, t.check_out)) AS total_work_time_minutes,  -- Tính tổng số phút làm việc
    (e.base_salary / (8 * DAY(LAST_DAY('2025-02-01')) * 60)) AS hourly_rate,  -- Tính đơn giá lương theo phút
    (SUM(TIMESTAMPDIFF(MINUTE, t.check_in, t.check_out)) * (e.base_salary / (8 * DAY(LAST_DAY('2025-02-01')) * 60))) AS total_salary,  -- Tính lương
    CASE
        WHEN SUM(TIMESTAMPDIFF(MINUTE, t.check_in, t.check_out)) IS NULL THEN 0  -- Xử lý trường hợp không có chấm công
        ELSE ROUND(SUM(TIMESTAMPDIFF(MINUTE, t.check_in, t.check_out)) / 60, 2)  -- Tính tổng số giờ làm việc (làm tròn 2 chữ số thập phân)
    END AS total_work_time_hours
FROM tb_employees e  -- Lấy dữ liệu từ bảng tb_employees và gán bí danh là e
LEFT JOIN tb_timesheets t ON e.employee_id = t.employee_id AND MONTH(t.days) = 2 AND YEAR(t.days) = 2025  -- Kết nối bảng tb_employees và tb_timesheets, lọc theo tháng 2/2025
GROUP BY e.employee_id, e.name;  -- Nhóm kết quả theo employee_id và name

select DAY(LAST_DAY('2025-02-01'));

SELECT
    DAY(LAST_DAY('2025-02-01')) - (
        SELECT COUNT(*)
        FROM (
            SELECT DATE('2025-02-01') + INTERVAL (n - 1) DAY AS dt
            FROM (
                SELECT a.n + b.n * 10 + 1 AS n
                FROM (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
                CROSS JOIN (SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS b
            ) AS numbers
            WHERE MONTH(DATE('2025-02-01') + INTERVAL (n - 1) DAY) = 2 AND YEAR(DATE('2025-02-01') + INTERVAL (n - 1) DAY) = 2025
            AND DAYOFWEEK(DATE('2025-02-01') + INTERVAL (n - 1) DAY) IN (1, 7) -- Đếm ngày thứ 7 và chủ nhật
        ) AS weekend_days
    ) AS working_days; -- Kết quả: 20