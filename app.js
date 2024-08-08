require('dotenv').config();

const express = require('express');
const { adminRouter } = require('./admin/routes/admin.route');
const { blogRouter } = require('./admin/routes/blog.route');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send('<center><h1>welcome to blog api server</h1></center>');
})

app.use('/admin',adminRouter);
app.use('/admin/blogs',blogRouter);

app.listen(port,()=>{
   console.log(`server is running on http://localhost:${port}`);
})