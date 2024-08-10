require('dotenv').config();

const express = require('express');
const { adminRouter } = require('./admin/routes/admin.route');
const { blogRouter } = require('./admin/routes/blog.route');
const configViewEngine = require('./viewEngine');
const app = express();
const port = process.env.PORT;
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const { dashBoardRouter } = require('./admin/routes/dashboard.route');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());

configViewEngine(app);

app.use(session({
    secret:'secret_key',
    resave:true,
    saveUninitialized:true
}))

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

app.use('/admin',dashBoardRouter);
app.use('/admin',adminRouter);
app.use('/admin',blogRouter);

app.listen(port,()=>{
   console.log(`server is running on http://localhost:${port}`);
})