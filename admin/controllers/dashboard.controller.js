const { Admin } = require("../models/admin.model");
const jwt = require('jsonwebtoken');
const { Blog } = require("../models/blog.model");

const getDashboardPage= async (req, res) => {
    try {
        const adminToken = req.cookies.adminJwt;

        if(adminToken){
            const decoded = jwt.verify(adminToken,process.env.admin_secret_key);
            const adminId = decoded.adminId;

            const admin = await Admin.findOne({where:{id:adminId}});
            const blogsCount = await Blog.count();
           return res.render('admin/index',{admin,blogsCount})
        }
        else{
            req.flash('error', 'Admin not found.');
            return res.redirect('/admin/login');
        }
    } catch (error) {
        console.error('Error executing Sequelize query: ', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = getDashboardPage