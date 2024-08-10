const { Blog } = require("../../admin/models/blog.model");

const UserController = {
    getUserBlog: async (req, res) => {
        try {
            const allblogs = await Blog.findAll();
            res.render('user/userblog', { allblogs });
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