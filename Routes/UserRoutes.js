const {getAllUsers , GetUserById, Createuser, updateuserById, DeleteUserById,disableuser,ableuser,followuserById,
    unfollowuserById, Login} = require("../Controller/UserController")

const express = require("express");
const { AuthenticateUser } = require("../utils");

const router = express.Router();
router.get("/" , AuthenticateUser ,  getAllUsers )
router.post("/login" , Login )
router.get("/:id" , GetUserById)
router.post("/createuser" , Createuser)
router.patch("/updateprofile",AuthenticateUser , updateuserById)
router.put("/disableuser",AuthenticateUser ,disableuser)
router.put("/ableuser",AuthenticateUser ,ableuser)
router.put("/follow",AuthenticateUser ,followuserById)
router.put("/unfollow",AuthenticateUser ,unfollowuserById)


module.exports = router;


