const blogController = require('../controllers/blog.controller');

const blogRouter = require('express').Router();

blogRouter.post('/add',blogController.addBlog);
blogRouter.get('/blog/:id',blogController.getBlogById);
blogRouter.get('/allblogs',blogController.getAllBlogs);
blogRouter.put('/editblog/:id',blogController.updateBlog);
blogRouter.delete('/deleteblog/:id',blogController.deleteBlog);




module.exports = {blogRouter}