const {getAllBlogs,getAllMyBlogs,getAllBlogsByKeywords ,getAllBlogsByCategory, GetBlogById, Createblog, updateblogById,
     DeleteBlogById, RateBlogById,CommentBlog,DeleteCommentBlog,AbleBlogById,DisableBlogById,
     GetBlogByIdadmin,getallblogsforadmin,EditCommentBlog,getfeed,getAllBlogsByAuthor
} = require("../Controller/BlogController")

const express = require("express");
const { AuthenticateUser } = require("../utils");

const router = express.Router();
// router.get("/" , AuthenticateUser ,  getAllBlogs )
router.get("/getallblogbyadmin",AuthenticateUser ,getallblogsforadmin)
router.get("/getblogsbycategory/:category",getAllBlogsByCategory)
router.get("/getblogsbykeyword/:keyword",getAllBlogsByKeywords)
router.get("/getblogsbyauthor/:author",getAllBlogsByAuthor)
router.get("/getallmyblogs/:id" ,AuthenticateUser,getAllMyBlogs)
router.get("/getfeed" ,AuthenticateUser,getfeed)
router.get("/getallblogs",AuthenticateUser ,getAllBlogs)
router.get("/:id" , GetBlogById)
router.post("/createblog",AuthenticateUser , Createblog)
router.patch("/updateblog",AuthenticateUser , updateblogById)
router.delete("/deleteblog",AuthenticateUser ,DeleteBlogById)
router.patch("/rateblog" ,RateBlogById)
router.put("/commentblog" ,CommentBlog)
router.put("/deletecommentblog" ,DeleteCommentBlog)
router.put("/editcommentblog" ,EditCommentBlog)
router.put("/ableblog" ,AuthenticateUser,AbleBlogById)
router.put("/disableblog" ,AuthenticateUser,DisableBlogById)
router.get("/getblogbyidadmin/:id",AuthenticateUser ,GetBlogByIdadmin)



module.exports = router;

