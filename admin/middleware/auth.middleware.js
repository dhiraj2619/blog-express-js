const jwt = require('jsonwebtoken');

const adminCheckedLoggedIn = (req, res, next) => {
    const adminToken = req.cookies.adminJwt;

    if (adminToken) {
        try {
            const decoded = jwt.verify(adminToken, process.env.admin_secret_key);
            const adminId = decoded.adminId;
            // Admin is logged in; proceed to the next middleware or route handler
            next();
        } catch (err) {
            // Token is invalid or expired; redirect to the admin login page
            res.redirect('/admin/login');
        }
    } else {
        // Admin token is not present in the cookies; redirect to the admin login page
        res.redirect('/admin/login');
    }
};

module.exports = adminCheckedLoggedIn;
