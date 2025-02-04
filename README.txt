To upload:
	git init
	git status
	git add .
	git commit -m "Upload from HN-PC"
	git remote add origin https://github.com/dmd2811/HR_system_project.git
	git push origin master
	
to download
	git clone https://github.com/dmd2811/HR_system_project.git
	

tutorial:
=== GIT_cmd ===
git --version : xem version của git
git config --list : kiểm tra config của local PC
git config --global user.name = "[name_github]" : điền tên đăng nhập của github
git config --global user.email = "[email_github]" : điển email sử dụng trong github

git init : khởi tạo git thì mới làm việc với git được
git remote -v : kiểm tra đang remote đến repository nào
git remote remove origin : xoá remote đang trỏ đến repository
git remote add origin https:// : thêm remote trỏ đến repository
git branch : kiểm tra branch trên local
git branch -r : kiểm tra branch trên repository
git branch --delete [branch-name] : xoá branch trên local
git push origin --delete [branch-name] : xoá branch trên repository
git status : kiểm tra trạng thái add vào git
git add . : thêm tất cả các file vào git
git add text.txt : thêm duy nhất 1 file text.txt vào git
git commit -m "message" : lưu hành động trong git của bạn và marking bằng message
git push origin [branch-name] : Push lên branch [branch-name] ứng với repository được remote từ đầu

