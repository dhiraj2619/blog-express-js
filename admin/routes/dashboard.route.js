const getDashboardPage = require('../controllers/dashboard.controller');
const adminCheckedLoggedIn = require('../middleware/auth.middleware');

const dashBoardRouter = require('express').Router();

dashBoardRouter.get('/',adminCheckedLoggedIn,getDashboardPage);

module.exports = {dashBoardRouter}