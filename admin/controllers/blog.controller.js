const { Blog } = require("../models/blog.model");
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const jwt = require('jsonwebtoken');
const { Admin } = require("../models/admin.model");
const { validationResult } = require("express-validator");

const blogController = {
    addBlog: async (req, res) => {
        const errorsArr = [];

        if(!req.body.title || !req.body.content || !req.body.date){
             req.flash('error','all fields required');
             return res.redirect('/admin/addblog');
        }

        let validationError = validationResult(req);

        if(!validationError.isEmpty()){
            let error = Object.values(validationError.mapped());

            error.forEach((item) => {
                errorsArr.push(item.msg);
            })
            req.flash("error", errorsArr);
        }
        try {
            const newblog = await Blog.create(req.body);
            req.flash('success','blog added successfully');
            return res.redirect('/admin/blog')
        } catch (error) {
            console.error("error creating blog");
            return res.status(500).json({ message: "error creating blog" });
        }
    },
    getBlogById: async (req, res) => {
        try {
            const blog = await Blog.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).json({ success: false, message: "Blog not found" });
            }
            res.json({ success: true, data: blog });
        } catch (error) {
            console.error("Error retrieving blog:", error);
            res.status(500).json({ success: false, message: "Error retrieving blog" });
        }
    },
    getAllBlogs: async (req, res) => {
        try {
            const month = req.query.month;
            const adminToken = req.cookies.adminJwt;
            const page = parseInt(req.query.page) || 1;
            const limit = 3; 
            const offset = (page - 1) * limit; 
    
            let whereClause = {};
            if (month) {
                whereClause = {
                    date: {
                        [Op.and]: [
                            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month)
                        ]
                    }
                };
            }
    
            const { count, rows: allblogs } = await Blog.findAndCountAll({
                where: whereClause,
                order: [['date', 'DESC']],
                limit: limit,
                offset: offset,
            });
    
            const totalPages = Math.ceil(count / limit); 
    
            if (adminToken) {
                const decoded = jwt.verify(adminToken, process.env.admin_secret_key);
                const adminId = decoded.adminId;
                const admin = await Admin.findOne({ where: { id: adminId } });
                
                return res.render('admin/blog', { 
                    allblogs, 
                    admin, 
                    currentPage: page, 
                    totalPages 
                });
            } else {
                return res.render('admin/blog', { 
                    admin: null, 
                    allblogs, 
                    currentPage: page, 
                    totalPages 
                });
            }
        } catch (error) {
            console.error("error getting blogs", error);
            return res.status(500).json({ message: "error getting blogs" });
        }
    },
    
    updateBlog: async (req, res) => {
        try {
            const blogId = req.params.id;
            const blog = await Blog.findByPk(blogId);
            if (!blog) {
                return res.status(404).json({ success: false, message: "Blog not found" });
            }
            const { id, ...updateData } = req.body;

            await Blog.update(updateData, {
                where: { id: blogId }
            });
            const updatedBlog = await Blog.findByPk(blogId);
            return res.status(200).json({ success: true, message: "Blog updated successfully", data: updatedBlog });
        } catch (error) {
            console.error("Error updating blog:", error);
            return res.status(500).json({ success: false, message: "Error updating blog" });
        }
    },
    deleteBlog: async (req, res) => {
        try {
            const blog = await Blog.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            await Blog.destroy({
                where: { id: req.params.id }
            });
            return res.status(200).json({ message: "Blog deleted successfully" });
        } catch (error) {
            console.error("Error deleting blog:", error);
            return res.status(500).json({ message: "Error deleting blog" });
        }
    }
}

module.exports = blogController