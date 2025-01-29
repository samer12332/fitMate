const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user.id);
    } catch(error) {
        done(error, null)
    }
})


passport.use(new GoogleStrategy({
    callbackURL: '/api/auth/google/callback',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}, async(accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        const currentUser = await User.findOne({email: profile.emails[0].value});
        if (currentUser) {
            done(null, currentUser);
        } else {
            const newUser = new User({
                email: profile.emails[0].value, 
                username: profile.displayName,
                googleId: profile.id
            });
            await newUser.save();
            console.log('new user created', newUser);
            done(null, newUser);
        }
    } catch(err) {
        console.error('Error during Google authentication:', err);
        done(err, null);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'displayName'],
    scope: ['email', 'public_profile']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        const currentUser = await User.findOne({email: profile.emails[0].value});
        if (currentUser) {
            done(null, currentUser)
        } else {
            const newUser = new User ({
                email: profile.emails[0].value,
                username: profile.displayName,
                facebookId: profile.id
            });
            await newUser.save();
            console.log('User created', newUser);
            done(null, newUser);
        }
    } catch (error) {
        console.error('Error during facebook authentication', error);
        done(error);
    }
}));


