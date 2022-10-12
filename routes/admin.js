var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-up',(req,res)=>{
  res.render("../views/users/sign-up.hbs")
})

module.exports = router;
