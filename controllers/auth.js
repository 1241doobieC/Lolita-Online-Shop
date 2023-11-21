const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length == 0) message = null;
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message
    });
} 

exports.postLogin = (req, res, next)=> {
    const email = req.body.email;
    const psd = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            req.flash( 'error', 'Invalid email or password. ');
            return res.redirect('/login');
        }
        bcrypt.compare(psd, user.password)
            .then(isMatched => {
                if(isMatched){
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        if (err) console.log(err);
                        res.redirect('/');
                    });
                } 
                else{
                    req.flash( 'error', 'Invalid email or password. ');
                    res.redirect('/login');
                }
            })
    })
    .catch(err => console.log(err));
}

exports.getSignup =(req, res, next) => {
    let message = req.flash('error');
    if(message.length == 0) message = null;
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false,
        errorMessage: message
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc) {
                req.flash( 'error', 'E-mail already exists.');
                return res.redirect('/signup');
            }
            else {
                return bcrypt.hash(password, 12)
                    .then(hashPsd => {
                        const user = new User({
                            email: email,
                            password: hashPsd,
                            cart: { items: [] }
                        })
                        return user.save();
                    })
                    .then(result => {
                        res.redirect('/login');
                    });
            }
        })
        .catch( err => {
            console.log(err);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy( err => {
        if(err) console.log(err);
        res.redirect('/');
    });
}