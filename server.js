const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
const userRouter = express.Router();

//let taskRouter = require('./routers/task');
const AccountModel = require('./models/accout');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const { json } = require('body-parser');
const { userInfo } = require('os');
const { Console } = require('console');

app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static(path.join(__dirname, 'public')))



app.get('/dangki1', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'register.html'))
})

// post dangki tk vào monggo

app.post('/dangki', (req, res) => {
  const { taikhoan, vaitro, matkhau } = req.body;

  AccountModel.findOne({ taikhoan }, (err, user) => {
    if (err)
      res.status(500).json({
        message: { msgBody: "Lỗi", msgError: true },
      });
    if (user)
      res.status(400).json({
        message: { msgBody: "Tài khoản đã tồn tại", msgError: false },
      });
    else {
      const newAccountModel = new AccountModel({ taikhoan, vaitro, matkhau });
      newAccountModel.save((err) => {
        if (err)
          res.status(500).json({
            message: { msgBody: "Lỗi", msgError: true },
          });
        else
          res.status(200).json({
            message: { msgBody: "Tạo tài khoản thành công", msgError: false },
          });
      });
    }
  });
});
module.exports = userRouter;



// get dangnhap vào todolist
app.get('/dangnhap', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'login.html'))
})

// post dangnhap vào todolist
app.post('/dangnhap', (req, res, next) => {
  var taikhoan = req.body.taikhoan;
  var matkhau = req.body.matkhau;
  AccountModel.findOne({
    taikhoan: taikhoan,
    matkhau: matkhau
  })
    .then(data => {
      if (data) {
        var token = jwt.sign({
          _id: data._id
        }, 'mk')
        return res.json({
          Message: 'Thanh Cong',
          token: token
        })
      } else {
        return res.status(300).json('Tai khoan khong đung')
      }

    })
    .catch(err => {
      res.status(500).json('Co loi bên server')
    })

})

//check dangnhap/////////////////////
var checkdangnhap = (req, res, next) => {

  try {
    var token = req.cookies.token
    var idU = jwt.verify(token, 'mk')
    AccountModel.findOne({
      _id: idU
    })
      .then(data => {
        if (data) {
          req.data = data
          next()
        } else {
          res.json('Bạn không có quyền truy cập')
        }

      })
      .catch(err => {

      })


  } catch (err) {
    res.status(500).json('Token k hợp lệ')
  }
}


//check quyền quản lí/////////////////////
var checkquanli = (req, res, next) => {
  var vaitro = req.data.vaitro;
  if (vaitro === 'quanli') {
    next()
  } else {
    res.json('Bạn không đủ thẩm quyền')
    //res.redirect('/dangnhap')
  }
}

//check quyền nhân viên/////////////////////
var checknhanvien = (req, res, next) => {
  var vaitro = req.data.vaitro;
  if (vaitro === 'quanli' || vaitro === 'nhanvien') { // quan li có thể vào vai trò nhân viên
    next()
  } else {
    res.json('Bạn không đủ thẩm quyền')
  }
}



app.get('/trangchu', checkdangnhap, (req, res, next) => {
  next()
}, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'home.html'))
})

app.get('/quanli', checkdangnhap, checkquanli, (req, res, next) => {
  next()
}, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'manager.html'))
})

app.get('/nhanvien', checkdangnhap, checknhanvien, (req, res, next) => {
  next()
}, (req, res, next) => {
  res.sendFile(path.join(__dirname, 'employee.html'))
})
//////////

// làm thử dki tài khoản chạy thử bên postman
app.post('/dangki1', (req, res, next) => {
  var taikhoan = req.body.taikhoan;
  var vaitro = req.body.vaitro;
  var matkhau = req.body.matkhau;

  AccountModel.findOne({
    taikhoan: taikhoan
  })
    .then(data => {
      if (data) {
        res.json('Tài khoản đã tồn tại, vui lòng tạo lại')
      } else {
        return AccountModel.create({
          taikhoan: taikhoan,
          vaitro: vaitro,
          matkhau: matkhau
        })
      }
    })
    .then(data => {
      res.json('Tạo tài khoản thành công')
    })
    .catch(err => {
      res.status(500).json('Tạo tài khoản thất bại')
    })
})

//làm thử đăng nhập tài khoản chạy thử bên postman
app.post('/dangnhap1', (req, res, next) => {
  var taikhoan = req.body.taikhoan;
  var matkhau = req.body.matkhau;

  AccountModel.findOne({
    taikhoan: taikhoan,
    matkhau: matkhau
  })
    .then(data => {
      if (data) {
        res.json('Đăng nhập thành công')
      } else {
        res.status(300).json('Tài khoản không đúng')
      }

    })
    .catch(err => {
      res.status(500).json('Có lỗi bên server')
    })
})
//

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'employee.html'))
})
app.listen(process.env.PORT ||3000, () => {
  console.log(`Server started on port`)
});
