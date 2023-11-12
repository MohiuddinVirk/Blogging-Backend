const user = require("../models/User.schema")
const blog=require("../models/Blog.schema")
const jwt = require("jsonwebtoken")
let getAllMyBlogs = async(req , res)=>{
  let id = req.params.id;
  let User=req.Tokendata;
  if(User.id===id){
    let blogs = await blog.find({Disabled:false,UserId:id});
    if(blogs)
    {
       res.status(200).json(blogs)
    }else
    {
      res.status(404).json({"Message":"Error" })
    }
  }
  else{
    res.status(404).json({"Message":"You do not have accessr" })
  }
  
}

let getAllBlogs = async(req , res)=>{
  let blogs = await blog.find({Disabled:false});
  if(blogs)
  {
     res.status(200).json(blogs)
  }else
  {
    res.status(404).json({"Message":"Error" })
  }
}
let getAllBlogsByCategory = async(req , res)=>{
  try {
    const category = req.params.category;
    console.log(category)
    const blogs = await blog.find({ Disabled: false, Category:{ $in: category } });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
let getAllBlogsByKeywords= async(req , res)=>{
  try {
    const keyword = req.params.keyword;
    const blogs = await blog.find({ Disabled: false, Keywords:{ $in: keyword } });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

let getAllBlogsByAuthor= async(req , res)=>{
  try {
    const keyword = req.params.author;
    const blogs = await blog.find({ Disabled: false, Username: keyword });
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}

let GetBlogById = async(req ,res)=>{
    let id = req.params.id;
    let users = await user.findOne({_id:id});
    if(users)
    {
       res.status(200).json(users)
    }else
    {
      res.status(404).json({"Message":"Error" , err:err})
    }
}


let getfeed = async(req ,res)=>{
  let id = req.Tokendata.id;
  let users = await user.findById(id);
 
  let feed=[];
  for(let i=0;i<users.Following.length;i++){
    let blogs=await blog.find({UserId:users.Following[i].UserId});
    for(let x=0;x<blogs.length;x++){
      feed.push(blogs[x])
    }
  }
  if(feed.length>0)
  {
    res.status(200).json(feed)
     
  }else
  {
    res.status(404).json({"Message":"Error or no feed yet" })
  }
}


let getallblogsforadmin = async(req ,res)=>{
  let Role=req.Tokendata.role
  if(Role==="Admin"){
    const blogs = await blog.find({});
    if(blogs)
    {
       res.status(200).json(blogs)
    }else
    {
      res.status(404).json({"Message":"Error" })
    }
  }
 else{
  res.status(404).json({"Message":"No Access" })
 }
}

let GetBlogByIdadmin = async(req ,res)=>{
  let Role=req.Tokendata.role;
  if(Role==="Admin"){
    let id = req.params.id;
    let findblog = await blog.findOne({_id:id});
    if(findblog)
    {
      res.status(200).json(findblog) 
    }else
    {
      res.status(404).json({"Message":"Error" })
    } 
  }else
  {
    res.status(404).json({"Message":"You dont have access" })
  }
  
}

let DisableBlogById = async(req ,res)=>{
  let User=req.Tokendata;
  if(User.role==="Admin"){
    let data = req.body;
    let id = data.BlogId;
    let findblog = await blog.findOne({_id:id});
    if(findblog)
    {
      findblog.Disabled=true;
      findblog.Reason=data.reason;
        let blogs = await blog.findByIdAndUpdate(data.BlogId , findblog);
        if(blogs)
        {
           res.status(200).json(blogs)
        }else
        {
          res.status(404).json({"Message":"Error"})
        }
    }else
    {
      res.status(404).json({"Message":"Error"})
    } 
  }
  else{
    res.status(404).json({"Message":"You do not have access"})
  }
 
}

let AbleBlogById = async(req ,res)=>{
  let User=req.Tokendata;
  if(User.role==="Admin"){
    let data = req.body;
    let id = data.BlogId;
    let findblog = await blog.findOne({_id:id});
    if(findblog)
    {
      findblog.Disabled=false;
      findblog.Reason="";
        let blogs = await blog.findByIdAndUpdate(data.BlogId , findblog);
        if(blogs)
        {
           res.status(200).json(blogs)
        }else
        {
          res.status(404).json({"Message":"Error"})
        }
    }else
    {
      res.status(404).json({"Message":"Error"})
    } 
  }
  else{
    res.status(404).json({"Message":"You do not have access"})
  }
  
}

//to be done one man can rate only one time
//get Userid from token to be implemented
let RateBlogById = async(req ,res)=>{
  let data = req.body;
  let blogs = await blog.findOne({_id:data.BlogId});
  if(blogs)
  {
    let Rating=blogs.Rating;
    let NumberofRatings=blogs.NumberofRatings;
    let totalrating=(Rating*NumberofRatings);
    let newtotalrating=Number(totalrating)+Number(data.newrating);
    let totalnumberofratings=NumberofRatings+1;
    Rating=newtotalrating/totalnumberofratings
    console.log(newtotalrating,totalnumberofratings)
    console.log(Rating)
    blogs.Rating=Rating;
    blogs.NumberofRatings=NumberofRatings+1;
    let updated=await blog.findByIdAndUpdate(data.BlogId , blogs);
    if(updated){
      res.status(200).json(updated)
    }else
    {
      res.status(404).json({"Message":"Error" , err:"err"})
    }
     
  }else
  {
    res.status(404).json({"Message":"Error" , err:"err"})
  }
}



let CommentBlog = async(req ,res)=>{
  const data= req.body;
  try {
    const blogId  = data.BlogId;
    const Comments  = data.comment; // Comments array with the new comment

    // Find the blog by ID
    const blogs = await blog.findById(blogId);
    if (!blogs) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Append the new comment to the Comments array
    blogs.Comments.push({commentText:Comments,Username:data.Username,UserId:data.UserId});

    // Save the updated blog document
    await blogs.save();

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}

let DeleteCommentBlog = async(req ,res)=>{
  const data = req.body;
  try {
    const blogId  = data.BlogId;

    // Find the blog by ID
    const blogs = await blog.findById(blogId);
    if (!blogs) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Append the new comment to the Comments array
    let tempcommnets=blogs.Comments;
    let index;
    for(let i=0;i<tempcommnets.length;i++){
      if(tempcommnets[i].UserId===data.UserId&&tempcommnets[i]._id==data.CommentId){
        index=i;
      }
    }
    blogs.Comments.splice(index,1);

    // Save the updated blog document
    await blogs.save();

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}
let EditCommentBlog = async(req ,res)=>{
  const data = req.body;
  try {
    const blogId  = data.BlogId;

    // Find the blog by ID
    const blogs = await blog.findById(blogId);
    if (!blogs) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Append the new comment to the Comments array
    let tempcommnets=blogs.Comments;
    let index;
    for(let i=0;i<tempcommnets.length;i++){
      let comid=tempcommnets[i]._id
      console.log(comid==data.CommentId)
      if(tempcommnets[i].UserId===data.UserId&&tempcommnets[i]._id==data.CommentId){
        index=i;
      }
    }
    blogs.Comments[index].commentText=data.comment;
    // blogs.Comments.findByIdAndUpdate(data.CommentId,data.data)

    // Save the updated blog document
    await blogs.save();

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

}

let Createblog = async (req , res)=>{
  const id=req.Tokendata.id;
  const User=await user.findById(id);
    let data = req.body;
    data.UserId=id;
    data.Username=User.FullName
    blog.create(data).then(data=>{
        res.status(201).json(data)
    }).catch(err=>{
        res.status(500).json({"Message":"there was Some Error"})
    })
}

let updateblogById = async(req ,res)=>{
  const Userid=req.Tokendata.id;
  const User=await user.findById(Userid);
  let data = req.body;
  let id = data.BlogId;
  let findblog = await blog.findOne({_id:id});
  if(findblog)
  {
  if(findblog.UserId===Userid){
        let blogs = await blog.findByIdAndUpdate(data.BlogId , data.data);
        if(blogs)
        {
           res.status(200).json(blogs)
        }
      else{
        res.status(404).json({"Message":"Error inner" })
      }
    
  }
  else{
    res.status(404).json({"Message":"You dont have access"})
  }
}else
{
  res.status(404).json({"Message":"Error" })
}
   
}

let DeleteBlogById =  async(req ,res)=>{
  const Userid=req.Tokendata.id;
  const User=await user.findById(Userid);
  let data = req.body;
  let id = data.BlogId;
  let findblog = await blog.findOne({_id:id});
  if(findblog)
  {
    if(Userid===findblog.UserId){
      let blogs = await blog.findByIdAndDelete(data.BlogId );
      if(blogs)
      {
         res.status(200).json(blogs)
      }else
      {
        res.status(404).json({"Message":"Error"})
      }
    }
    else{
      res.status(404).json({"Message":"You don't have access" })
    }
  }else
  {
    res.status(404).json({"Message":"Error" })
  }  
}


module.exports  ={
    GetBlogById,
    getAllBlogs,
    updateblogById,
    DeleteBlogById,
    getAllBlogsByCategory,
    getAllBlogsByKeywords,
    getAllMyBlogs,
    RateBlogById,
    CommentBlog,
    Createblog,
    DeleteCommentBlog,
    AbleBlogById,
    DisableBlogById,
    GetBlogByIdadmin,
    EditCommentBlog,
    getallblogsforadmin,
    getAllBlogsByAuthor,
    getfeed
}