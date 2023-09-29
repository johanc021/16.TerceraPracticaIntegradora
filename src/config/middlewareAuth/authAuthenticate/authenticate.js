import passport from 'passport';

export function authenticate(req, res, next) {
    passport.authenticate('current', { session: false })(req, res, () => {
        if (!req.isAuthenticated()) {
            return res.redirect("/login");
        }
        req.user
        next();
    });
}