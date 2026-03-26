import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pgClient from '../../config/db.js';
import APIError from '../../config/APIError.js';
import httpStatus from 'http-status';
import config from 'config';

passport.use(new LocalStrategy({
    usernameField: 'mobile_no',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req,mobile_no, password, done) => {
    try {
        const user = await pgClient.getRowsQuery(
            'SELECT * FROM public.admin WHERE mobile_no = $1 AND is_active = true',
            [mobile_no]
        );

        if (!user || user.length === 0) {
            return done(null, false, { message: 'Invalid mobile number or inactive account.' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user[0]);
    } catch (err) {
        return done(err);
    }
}));

// Session Serialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await pgClient.getRowsQuery('SELECT * FROM public.admin WHERE id = $1', [id]);
        done(null, user[0]);
    } catch (err) {
        done(err);
    }
});

export default passport;