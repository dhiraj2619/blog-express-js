const adminController = require('../controllers/admin.controller');


const adminRouter = require('express').Router();

adminRouter.post('/register',adminController.RegisterAdmin);
adminRouter.post('/login',adminController.Login);
adminRouter.get('/logout',adminController.logoutAdmin);

// getting pages

adminRouter.get('/blog',adminController.getBlogPage);
adminRouter.get('/addblog',adminController.getCreateBlog);
adminRouter.get('/login',adminController.getLoginPage);
adminRouter.get('/signup',adminController.getSignupPage);

module.exports = {adminRouter}