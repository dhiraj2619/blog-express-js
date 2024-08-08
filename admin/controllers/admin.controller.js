const { Admin } = require("../models/admin.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminController = {
    RegisterAdmin:async(req,res)=>{
        try {
            const emailExist = await Admin.findOne({
                where:{
                    email:req.body.email
                }
            });
            
            if(emailExist){
                 return res.status(409).json({message:"user already exists"});
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password,saltRounds);
            
            const newAdmin = {
                name:req.body.name,
                email:req.body.email,
                password:hashedPassword
            }

            const admin = await Admin.create(newAdmin);
            return res.status(201).json({message:"Admin created successfully...please login",admin})
        } catch (error) {
            console.error("error creating admin",error);
            return res.status(500).json({message:"Internal server error"})
        }
    },
    Login:async(req,res)=>{
        try {
            const {email,password} = req.body;

            const admin = await Admin.findOne({where:{email}});

            if(!admin){
               return res.status(400).json({message:'user not found with this email id'});
            }
            const storedpassword = admin.password;

            const passwordMatch = await bcrypt.compare(password,storedpassword);

            if(passwordMatch){
                const token = jwt.sign({ adminId: admin.id }, process.env.admin_secret_key);   
                res.cookie('adminJwt', token, { httpOnly: true, secure: true });
               return res.status(201).json({message:'login success'});
            }
            else{
                return res.status(400).json({message:'incorrect password'});
            }
        } catch (error) {
            console.error("internal server error",error);
            return res.status(500).json({message:"internal server error"})
        }
    }
}

module.exports = adminController