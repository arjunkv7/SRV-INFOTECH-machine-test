var express = require('express');
const { unregisterHelper } = require('handlebars');
var router = express.Router();
var userHelper = require('../helpers/userHelper')

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

  userHelper.doSignUp(userData).then((result)=>{
    console.log("sign Up successfull ")
    res.send("message:true")
  }).catch((data)=>{

  })
})

router.get('/dash-board',(req,res)=>{
res.render('../views/users/dash-board.hbs')
})

router.get('/login',(req,res)=>{
res.render('../views/users/login-page.hbs')
})

router.get('/all-users',(req,res)=>{

userHelper.getAllUsers().then((allUsers)=>{
  res.render("../views/users/all-users.hbs",{allUsers})
})
})

router.get('/delete-user',(req,res)=>{
  let user = req.query.email;

  userHelper.removeUser(user).then((result)=>{
    res.send('user removed successfully')
  })
})

router.get('/edit-profile',(req,res)=>{
  
  
})

module.exports = router;
