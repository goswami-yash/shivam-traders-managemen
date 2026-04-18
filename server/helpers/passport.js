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
        const result = await pgClient.query("SELECT * FROM login_get_user_by_mobile($1)",
            [mobile_no]
        );
         
        const user = result.rows[0];
     
        if (!user) {
            return done(null, false, { message: 'Invalid mobile number or inactive account.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        await delete user.password;
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Session Serialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (userid, done) => {
   
    try {const id = userid.id;// Handle both user and session objects
        const user = await pgClient.getRowsQuery('SELECT * FROM public.admin WHERE id = $1', [id]);
        done(null, user[0]);
    } catch (err) {
        done(err);
    }
});

passport.isLoggedIn = function (req, res, next) {
    try {
        if (req.isAuthenticated()) {
          return next();
        }
    
        let retVal = {
          success: false,
          message: "Sorry,You are not Authorized.!",
        };
        res.status(401).send(retVal);
      } catch (error) {
        console.log(error);
        let err = new APIError("You are not authorized please login first.", status.UNAUTHORIZED, true, true);
        next(err);
      }
    };

export default passport;