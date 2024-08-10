const { Admin } = require("../models/admin.model");
const jwt = require('jsonwebtoken');

const getDashboardPage= async (req, res) => {
    try {
        const adminToken = req.cookies.adminJwt;

        if(adminToken){
            const decoded = jwt.verify(adminToken,process.env.admin_secret_key);
            const adminId = decoded.adminId;

            const admin = await Admin.findOne({where:{id:adminId}});
           return res.render('admin/index',{admin})
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