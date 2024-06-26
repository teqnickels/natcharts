require("dotenv").config();
const helper = require('./scripts/helper');
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const { Strategy: GitHubStrategy } = require('passport-github2')
const partials = require("express-partials");
const path = require("path");

const { ensureAuthenticated, strategy, sessionConfig } = require('./utils');
const app = express()



passport.use(strategy)
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))



app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(partials());
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())



app.get("/", (req, res) => {

  res.render("index", { user: req.user });
});

app.get('/account', ensureAuthenticated, (req, res) => {

  const data = res.req.user;

  if ( data.displayName === null ) {
    data.displayName = data.username;
  }

  //USE THIS SECTION IN PROD

  if ( data.id === process.env.USERAUTHID  ) {
    res.render("account", { user: data });
  } else {
    res.redirect("/");
  }
  

  /*TEMPORARY FOR DEV ONLY - USE THIS TO GET YOUR GITHUB ID NUMBER
  res.render("account", { user: data });
*/

});

app.get('/charts', ensureAuthenticated, (req, res) => {

  const data = res.req.user;
  const westernCharts = helper.testFunc();

  if ( data.id === process.env.USERAUTHID  ) {
    res.render("charts", { user: data, westernCharts: westernCharts });
  } else {
    res.redirect("/");
  }
})

app.get("/login", (req, res) => res.render("login", { user: req.user }))

app.get("/logout", (req, res) => {
    req.logout(()=>{
      res.redirect("/");
    });
});

app.get('/auth/github', passport.authenticate('github', { scope: [ 'user' ]}))

app.get('/auth/github/callback', passport.authenticate('github', { 
    failureRedirect: '/login' ,
    successRedirect: '/'
}))

app.listen(process.env.PORT, () => console.log(`Listening on http://localhost:${process.env.PORT}/`))
