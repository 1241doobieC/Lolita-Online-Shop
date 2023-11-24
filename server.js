const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const passport = require('passport');

const MongoDBStore = require('connect-mongodb-session')(session);
const mongoConnect = require('./util/db').mongoConnect;
require('dotenv').config();

const adminRoutes =require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const User = require('./models/user');


const app = express();
const csrfProtection = csrf();

const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 24 * 14
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
})); 

app.use(csrfProtection);
app.use( flash() );
app.use(passport.initialize());
app.use(passport.session());

app.use( (req, res, next) => {
    if(!req.session.user) return next();
    User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use( (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
}) 

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use( errorController.get404  );
mongoose.connect(process.env.DB_CONNECT)
    .then( () => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    }); 