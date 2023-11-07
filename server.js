const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes =require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const dbConnect = require('./util/db');
const app = express()

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use( errorController.get404  );
dbConnect( client => {
    console.log(client);
    app.listen(3000);
});