const UserController = require('../controllers/user.controller');

const userRouter = require('express').Router();

userRouter.get('/',UserController.getUserBlog);
userRouter.get('/blog/:id',UserController.getSingleBlog);

module.exports = {userRouter}