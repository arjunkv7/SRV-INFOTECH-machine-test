var express = require('express');
const { unregisterHelper } = require('handlebars');
const async = require('hbs/lib/async');
var router = express.Router();
var userHelper = require('../helpers/userHelper')
var verifyToken = require('../helpers/auth-middleware')
var fs = require("fs")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render("../views/users/home-page.hbs");
});

router.get('/sign-up',(req,res)=>{
  res.render("../views/users/sign-up.hbs")
})

router.post("/sign-up",(req,res)=>{
  let userData = req.body;
  console.log( userData)
  if (!(userData.email && userData.password && userData.fullName && userData['email'] && userData.password && userData.city)) {
    res.status(400).send({message:"All inputs required"});
  }

  userHelper.doSignUp(userData).then((result)=>{
    console.log("sign Up successfull ")
    res.render('../views/users/login-page.hbs')
  }).catch((data)=>{

  })
})

router.get('/dash-board',(req,res)=>{
res.render('../views/users/dash-board.hbs')
})

router.get('/login',(req,res)=>{
res.render('../views/users/login-page.hbs')
})

router.post('/login', (req,res)=>{
  let loginDetails = req.body;
  console.log(loginDetails)
  userHelper.validateLoginDetails(loginDetails).then(async (user)=>{
    console.log('details validated')

    let token = await userHelper.getToken(user)
    // user.token = token;
    // delete user.password;
    console.log(user)
    res.render('../views/users/dash-board.hbs',{token:token})
    res.cookie("token", token, {
      httpOnly: true,})

  }).catch((result)=>{
    console.log(result)
    let err = result.err
    if(result)res.render('../views/users/login-page.hbs',{err})
  })
})

router.get('/all-users',verifyToken,(req,res)=>{
let token = req.query.token
userHelper.getAllUsers().then((allUsers)=>{
  res.render("../views/users/all-users.hbs",{allUsers,token})
})
})

router.get('/delete-user',(req,res)=>{
  let user = req.query.email;
  let token = req.query.token;

  // userHelper.removeUser(user).then((result)=>{
  //   res.render('../views/users/all-users',{token})
  // })
  userHelper.removeUser(user).then((result)=>{
  userHelper.getAllUsers().then((allUsers)=>{
    res.render("../views/users/all-users.hbs",{allUsers,token})
  })
})
})

router.get('/edit-profile',verifyToken,(req,res)=>{
  console.log(req.user)
  let token = req.query.token
  userHelper.getDetails(req.user).then((userDetails)=>{
    res.render('../views/users/edit-profile.hbs',{userDetails,token})
  })
})

router.post('/edit-profile',verifyToken,(req,res)=>{
  var newUserDetails = req.body
  let token = req.query.token
  userHelper.editProfile(newUserDetails).then((result)=>{
    res.render('../views/users/dash-board.hbs',{token})

  }).catch((error)=>{
    let err = error.err;
    let token = req.query.token;
    userHelper.getDetails(req.user).then((userDetails)=>{
    res.render('../views/users/edit-profile.hbs',{err,userDetails,token})
  })
  })
})

router.get('/download-file',(req,res)=>{
  userHelper.getUserFile().then((file)=>{
    res.download(file,(err)=>{
      if(err){
        fs.unlinkSync(file)
        res.send('Unable to download the file')
      }
      fs.unlinkSync(file)
    })

    
    
  })
})

module.exports = router;
