const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/db').mongoConnect;

const adminRoutes =require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const User = require('./models/user');

const app = express()

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use( (req, res, next) => {
    User.findById('654bd13d9a998a4040a5227a')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(error => {console.log(error)})
});

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use( errorController.get404  );
mongoConnect( () => {
    app.listen(3000);
});  