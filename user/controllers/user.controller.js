const { Blog } = require("../../admin/models/blog.model");

const UserController = {
    getUserBlog: async (req, res) => {
        try {
           
            const page = parseInt(req.query.page) || 1;
            const limit = 3;

            const offset = (page - 1) * limit;
            const { count, rows: allblogs } = await Blog.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['date', 'DESC']],
            });
            const totalPages = Math.ceil(count / limit);
            res.render('user/userblog', { allblogs,  currentPage: page,  
                totalPages  });
        } catch (error) {
            console.error("unable to get blog page");
            res.status(500).json({ message: "Internal server error" });
        }
    },
    getSingleBlog: async (req, res) => {
        try {
            const blogId = req.params.id;

            const blog = await Blog.findOne({
                where: {
                    id: blogId
                }
            });

            if (blog) {
                return res.render('user/singleblog', { blog })
            }
            else {
                return res.redirect('user/');
            }
        } catch (error) {
            console.error("Unable to get single blog", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = UserController;