const adminController = require('../controllers/admin.controller');

const adminRouter = require('express').Router();

adminRouter.post('/register',adminController.RegisterAdmin);
adminRouter.post('/login',adminController.Login);

module.exports = {adminRouter}