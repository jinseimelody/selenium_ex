Setup
1. cài đặt library package 
2. cài đặt driver
  - kiểm tra version chrome trên máy (ex: 98.0.4758.102)
  - truy cập đường dẫn sau (https://chromedriver.storage.googleapis.com/index.html) tải về chromedriver_win32.zip tương ứng với phiên bản chrome
  - giải nén chromedriver_win32.zip chọn đường dẫn (ex: C:/Celenium)
  - thêm biến môi trường tại đường dẫn (ex: C:/Celenium)
3. start code
  - tham khảo: https://www.selenium.dev/documentation
4. run
  - npm test (mocha will sequentially run all .js, .mjs or .cjs under ./test folder)
