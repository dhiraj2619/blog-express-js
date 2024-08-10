const { Admin } = require("../models/admin.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Blog } = require("../models/blog.model");
const { validationResult } = require("express-validator");

const adminController = {
    RegisterAdmin: async (req, res) => {
        let errorsArr = [];

        if(!req.body.name || !req.body.email || !req.body.password){
             req.flash('error','All fields required');
             return res.redirect('/admin/signup')
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
            const emailExist = await Admin.findOne({
                where: {
                    email: req.body.email
                }
            });

            if (emailExist) {
                req.flash('error', 'User already exists.');
                return res.redirect('/admin/signup');
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

            const newAdmin = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }

            const admin = await Admin.create(newAdmin);
            req.flash('success', 'admin created successfully...please log in.');
            return res.redirect('/admin/login')
        } catch (error) {
            console.error("error creating admin", error);
            req.flash('error', 'faild to create admin.');
            return res.redirect('/admin/signup')
        }
    },
    Login: async (req, res) => {
        let errorsArr = [];

        if(!req.body.email || !req.body.password){
             req.flash('error','please enter login credentials');
             return res.redirect('/admin/login')
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
            const { email, password } = req.body;

            const admin = await Admin.findOne({ where: { email } });

            if (!admin) {
                req.flash('error', 'admin not found.');
                return res.redirect('/admin/login');
            }
            const storedpassword = admin.password;

            const passwordMatch = await bcrypt.compare(password, storedpassword);

            if (passwordMatch) {
                const token = jwt.sign({ adminId: admin.id }, process.env.admin_secret_key);
                res.cookie('adminJwt', token, { httpOnly: true, secure: true });
                return res.redirect('/admin');
            }
            else {
                req.flash('error', 'Incorrect password.');
                return res.redirect('/admin/login');
            }
        } catch (error) {
            console.error("internal server error", error);
            req.flash('error', 'internal server error.');
        }
    },
    logoutAdmin:async(req,res)=>{
      try {
        res.clearCookie('adminJwt');
        res.redirect('/admin/login');
      } catch (error) {
         req.flash('error','unable to logout admin')
      }
    },
   
    getBlogPage: async (req, res) => {
        try {
            const adminToken = req.cookies.adminJwt;
            let admin = null;
            if (adminToken) {
                const decoded = jwt.verify(adminToken, process.env.admin_secret_key);
                admin = await Admin.findOne({ where: { id: decoded.adminId } });
            }
            const page = parseInt(req.query.page) || 1; 
            const limit = 3;
            const offset = (page - 1) * limit;
            const { count, rows: allblogs } = await Blog.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['date', 'DESC']],
            });
            const totalPages = Math.ceil(count / limit);
            res.render('admin/blog', {
                admin,
                allblogs,
                currentPage: page,  
                totalPages, 
            });
        } catch (error) {
            console.error('Error executing Sequelize query: ', error);
            res.status(500).send('Internal Server Error');
        }
    },
    getCreateBlog: async (req, res) => {
        
      
        try {
            const adminToken = req.cookies.adminJwt;

            if(adminToken){
                const decoded = jwt.verify(adminToken,process.env.admin_secret_key);
                const adminId = decoded.adminId;
                const admin = await Admin.findOne({where:{
                    id:adminId
                }})
                res.render('admin/addblog',{admin})
            }
        } catch (error) {
            console.error('Error executing Sequelize query: ', error);
            res.status(500).send('Internal Server Error');
        }
    },
    getLoginPage:async(req,res)=>{
       try {
           res.render('admin/login');
       } catch (error) {
        console.error('Error executing Sequelize query: ', error);
        res.status(500).send('Internal Server Error');
       }
    },
    getSignupPage:async(req,res)=>{
       try {
           res.render('admin/signup');
       } catch (error) {
        console.error('Error executing Sequelize query: ', error);
        res.status(500).send('Internal Server Error');
       }
    }
}

module.exports = adminController