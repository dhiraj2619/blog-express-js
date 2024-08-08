const { Blog } = require("../models/blog.model")

const blogController = {
    addBlog: async (req, res) => {
        try {
            const newblog = await Blog.create(req.body);
            return res.status(201).json({ message: "blog created successfully", newblog })
        } catch (error) {
            console.error("error creating blog");
            return res.status(500).json({ message: "error creating blog" });
        }
    },
    getBlogById: async (req, res) => {
        try {
            const blog = await Blog.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            return res.status(200).json({ blog });
        } catch (error) {
            console.error("Error fetching blog by ID:", error);
            return res.status(500).json({ message: "Error fetching blog" });
        }
    },
    getAllBlogs: async (req, res) => {
        try {
            const allblogs = await Blog.findAll();
            return res.status(200).json({ allblogs });
        } catch (error) {
            console.error("error getting blogs", error);
            return res.status(500).json({ message: "error getting blogs" });
        }
    },
    updateBlog: async (req, res) => {
        try {
            const blog = await Blog.findByPk(req.params.id);
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            await Blog.update(req.body, {
                where: { id: req.params.id }
            });

            const updatedBlog = await Blog.findByPk(req.params.id);
            return res.status(200).json({ message: "Blog updated successfully", updatedBlog });
        } catch (error) {
            console.error("Error updating blog:", error);
            return res.status(500).json({ message: "Error updating blog" });
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