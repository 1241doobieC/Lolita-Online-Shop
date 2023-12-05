const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const User = require('../models/user');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ACCOUNT,
      pass: process.env.GMAIL_PSD,
    },
});

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback   : true,
    prompt: 'select_account'
  },
  function(request, accessToken, refreshToken, profile, done) {
    // console.log("Profile: ",profile);
    User.findOrCreate({ googleId: profile.id, email: profile.email, },  (err, user) => {
      return done(err, user);
    });
  }
)); 

passport.serializeUser((user, cb) => {
    cb(null, user);
});
  
passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

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
    req.logout( err => {
        if (err) { return next(err); }
        else{
            req.session.destroy( err => {
                if(err) console.log(err);
                res.redirect('/');
            });
        }
    });
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if(message.length == 0) message = null;
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    let sendMail = req.body.email;
    crypto.randomBytes(32 , ( (err, buffer) => {
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: sendMail})
            .then( user => {
                if(!user){
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(async result => {
                await transporter.verify();

                const mailOptions = {
                    from: process.env.GMAIL_ACCOUNT,
                    to: sendMail,
                    subject: 'Password Reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `,
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                      console.error(err);
                      res.status(500).send('Error sending email');
                    } else {
                      res.redirect('/login');
                    }
                });
            })
            .catch(err => {
                
            })
    }));
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.find({ resetToken: token, resetTokenExpiration: { $gt: new Date()} })
            .then(user => {
                let message = req.flash('error');
                if(message.length == 0) message = null;
                res.render('auth/new-password', {
                    path: '/new-password',
                    pageTitle: 'Reset Password',
                    errorMessage: message,
                    userId: user[0]._id.toString(),
                    passwordToken: token
                });
            })
            .catch(err => {
                console.log(err);
            });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ 
        resetToken: passwordToken, 
        resetTokenExpiration:{$gt: new Date()},
        _id: userId
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then( hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;

        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.googleLogin =  passport.authenticate('google', {
    scope:[ 'email', 'profile' ],
    prompt: 'select_account'
});

exports.googleCallback = (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login');
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
                if (err) {
                    console.log(err);
                } 
                res.redirect('/');
            });
        });
    })(req, res, next);
};
