import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pgClient from '../../config/db.js';
import APIError from '../../config/APIError.js';
import httpStatus from 'http-status';


// =====================================================
// LOCAL STRATEGY
// =====================================================

passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'mobile_no',
            passwordField: 'password',
            passReqToCallback: true,
        },

        async (req, mobile_no, password, done) => {
            try {

                console.log('🔑 [LOGIN] Mobile:', mobile_no);

                const result = await pgClient.query(
                    'SELECT * FROM login_get_user_by_mobile($1)',
                    [mobile_no]
                );

                const dbUser = result.rows[0];

                if (!dbUser) {
                    return done(null, false, {
                        message: 'Invalid mobile number or inactive account.',
                    });
                }

                const isMatch = await bcrypt.compare(
                    password,
                    dbUser.password
                );

                if (!isMatch) {
                    return done(null, false, {
                        message: 'Incorrect password.',
                    });
                }

                // Remove password
                const {
                    password: _password,
                    ...safeUser
                } = dbUser;

                console.log('✅ [LOGIN SUCCESS]', safeUser);

                return done(null, safeUser);

            } catch (err) {

                console.error('❌ [LOGIN ERROR]', err);

                return done(err);
            }
        }
    )
);


// =====================================================
// SERIALIZE
// =====================================================

passport.serializeUser((user, done) => {

    console.log('➡️ [SERIALIZE USER]');
    console.log('User:', user);

    // Current session stores the user object
    done(null, user);
});


// =====================================================
// DESERIALIZE
// =====================================================

passport.deserializeUser(async (sessionUser, done) => {

    console.log('⬅️ [DESERIALIZE USER]');
    console.log('Session user:', sessionUser);

    try {

        if (!sessionUser) {

            console.log(
                '❌ [DESERIALIZE] Session user is missing'
            );

            return done(null, false);
        }

        const mobile_no = sessionUser.mobile_no;

        console.log(
            '🔎 [DESERIALIZE] Looking up mobile:',
            mobile_no
        );

        if (!mobile_no) {

            console.log(
                '❌ [DESERIALIZE] mobile_no missing from session'
            );

            return done(null, false);
        }

        const result = await pgClient.query(
            'SELECT * FROM login_get_user_by_mobile($1)',
            [mobile_no]
        );

        const dbUser = result.rows[0];

        if (!dbUser) {

            console.log(
                '❌ [DESERIALIZE] User not found:',
                mobile_no
            );

            return done(null, false);
        }

        // Remove password
        const {
            password: _password,
            ...safeUser
        } = dbUser;

        console.log(
            '✅ [DESERIALIZE SUCCESS]',
            safeUser
        );

        return done(null, safeUser);

    } catch (err) {

        console.error(
            '💥 [DESERIALIZE DB ERROR]:',
            err
        );

        return done(err);
    }
});


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

passport.isLoggedIn = function (req, res, next) {

    try {

        console.log(
            '🔐 [IS_LOGGED_IN CHECK]',
            req.isAuthenticated()
        );

        console.log(
            '👤 [REQ.USER]',
            req.user
        );

        console.log(
            '🆔 [SESSION ID]',
            req.sessionID
        );

        console.log(
            '📦 [SESSION]',
            req.session
        );

        if (req.isAuthenticated()) {
            return next();
        }

        console.log(
            '❌ [IS_LOGGED_IN] Access denied'
        );

        return res.status(401).json({
            success: false,
            message: 'Sorry, You are not Authorized.!',
        });

    } catch (error) {

        console.error(
            '💥 [IS_LOGGED_IN ERROR]',
            error
        );

        const err = new APIError(
            'You are not authorized please login first.',
            httpStatus.UNAUTHORIZED,
            true,
            true
        );

        return next(err);
    }
};


export default passport;