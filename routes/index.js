var express = require('express');
var router = express.Router();

const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategry = require("passport-local");
passport.use(new localStrategry(userModel.authenticate()));
const upload = require("./multer");



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  // console.log(req.flash("error"));
  res.render('login',{error:req.flash('error')});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.get('/profile', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts");
  // console.log(user);    
  res.render("profile",{user});
});

// router.route('/login')
//   .get(function(req, res, next) {
//     res.render('login');
//   })
//   .post(passport.authenticate("local", {
//     successRedirect: "/profile",
//     failureRedirect: "/"
//   }));


router.post('/register', (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});

router.post('/login', passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}),function(req, res) {
});

router.get('/logout',function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})


function isLoggedIn (req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

//multer upload route

router.post("/upload",isLoggedIn,upload.single("file"), async function(req,res,next){
  if(!req.file){
    return res.status(400).send("No Files were uploaded");
  }
  // res.send("File uploaded successfully");
  const user = await userModel.findOne({username: req.session.passport.user})
  
  const postData = await postModel.create({
    image: req.file.filename,
    imageText: req.body.caption,
    userId: user._id
  });

  user.posts.push(postData._id);
  await user.save();
  res.redirect("/profile");
})

module.exports = router;
