const blogController = require('../controllers/blog.controller');

const blogRouter = require('express').Router();

blogRouter.post('/add',blogController.addBlog);
blogRouter.get('/:id',blogController.getBlogById);
blogRouter.get('/allblogs',blogController.getAllBlogs);
blogRouter.put('/:id',blogController.updateBlog);
blogRouter.delete('/:id',blogController.deleteBlog);


module.exports = {blogRouter}