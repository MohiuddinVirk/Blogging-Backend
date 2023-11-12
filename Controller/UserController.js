
const user = require("../models/User.schema")
const jwt = require("jsonwebtoken")
let getAllUsers = async(req , res)=>{
    let users = await user.find({});
    if(users)
    {
       res.status(200).json(users)
    }else
    {
      res.status(404).json({"Message":"Error" , err:err})
    }
}

let GetUserById = async(req ,res)=>{
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



let Createuser =async (req , res)=>{
  let {email } = req.body;
let User = await user.findOne({email});
if(User){
  res.status(500).json({"Message":"A same user exists with this email enter another email"})
}
else{
  let data = req.body;
  user.create(data).then(data=>{
      res.status(201).json(data)
  }).catch(err=>{
      res.status(500).json({"Message":"there was Some Error"})
  })
}
   
}

let updateuserById = async(req ,res)=>{
  let User=req.Tokendata
    let id = User.id;
    let data = req.body;
    let users = await user.findByIdAndUpdate(id , data);
    if(users)
    {
       res.status(200).json(users)
    }else
    {
      res.status(404).json({"Message":"Error" , err:err})
    }
}

let followuserById = async(req ,res)=>{
  const id=req.Tokendata.id;
  const settobefollowed = await user.findById(id);
    const data= req.body;
    try {
      const tobefollowed  = data.tobefollowed;
      if (!settobefollowed) {
        return res.status(404).json({ error: 'Account not found' });
      }
  
      // Append the new comment to the Comments array
      settobefollowed.Following.push({Username:data.Username,UserId:data.tobefollowed});
  
      // Save the updated blog document
      await settobefollowed.save();
  
      res.json(settobefollowed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
}

let unfollowuserById = async(req ,res)=>{
    const data= req.body;
    const id=req.Tokendata.id;
  const settobeunfollowed = await user.findById(id);
    try {
      const UserId  = data.UserId; // Comments array with the new comment
  
      if (!settobeunfollowed) {
        return res.status(404).json({ error: 'Account not found' });
      }
      let temparr=settobeunfollowed.Following;
      
    let index=null;
    for(let i=0;i<temparr.length;i++){
      if(temparr[i].UserId===data.tobeunfollowed){
        index=i;
      }
    }
        settobeunfollowed.Following.splice(index,1);

  
      // Save the updated blog document
      await settobeunfollowed.save();
  
      res.json(settobeunfollowed);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
}
//to be done
let getfollowers = async(req ,res)=>{
    let id = req.params.id;
    let data = req.body;
    let users = await user.findByIdAndUpdate(id , data);
    if(users)
    {
       res.status(200).json(users)
    }else
    {
      res.status(404).json({"Message":"Error" , err:err})
    }
}
//to be done
let getfollowing = async(req ,res)=>{
    let id = req.params.id;
    let data = req.body;
    let users = await user.findByIdAndUpdate(id , data);
    if(users)
    {
       res.status(200).json(users)
    }else
    {
      res.status(404).json({"Message":"Error" , err:err})
    }
}


let disableuser = async(req ,res)=>{
  if(req.Tokendata.role!=="Admin"){
    res.status(403).json({"Message":"You dont have access"})
  }
  else{
    let data = req.body;
    let id = data.UserId;
    let users = await user.findOne({_id:id});
    if(users)
    {
        users.blocked=true;
        users.reason=data.reason;
        let usersupdated = await user.findByIdAndUpdate(id , users);
        if(usersupdated)
        {
           res.status(200).json(usersupdated)
        }else
        {
          res.status(404).json({"Message":"Error"})
        }
    }else
    {
      res.status(404).json({"Message":"Error"})
    } 
  }
   
}

let ableuser = async(req ,res)=>{
  if(req.Tokendata.role!=="Admin"){
    res.status(403).json({"Message":"You dont have access"})
  }
  else{
    let data = req.body;
    let id = data.UserId;
    let users = await user.findOne({_id:id});
    if(users)
    {
        users.blocked=false;
        users.reason="";
        let usersupdated = await user.findByIdAndUpdate(id , users);
        if(usersupdated)
        {
           res.status(200).json(usersupdated)
        }else
        {
          res.status(404).json({"Message":"Error"})
        }
    }else
    {
      res.status(404).json({"Message":"Error"})
    } 
  }

    
}

let DeleteUserById =  async(req ,res)=>{
    let id = req.params.id;
    let users = await user.findByIdAndDelete(id);
    if(users)
    {
       res.status(200).json(users)
    }else
    {
      res.status(404).json({"Message":"Error" , err:err})
    }
}

let Login = async(req , res)=>{
    let {email , Password} = req.body;
    console.log(Password)
    console.log(req.body)
    try{
        let User = await user.findOne({email});
        if(User)
        {
          if(!User.blocked){
            console.log(User.Password)
            if(User.Password == Password)
            {
                let {Password , ...rest} = User
                let id = User._id;
                let role = User.role
                let token = await jwt.sign({id , role} ,
                     process.env.SECRET_KEY ,
                      {expiresIn :'30d'})
                res.json({rest , "Success":true , token})
            }else
            {
                res.json({ "Success":false , "Message":"Invalid password"})

            }
          }
          else{
            res.json({ "Success":false , "Message":"Your account has been blocked"})

          }
            
        }else
        {
            res.json({ "Success":false , "Message":"User not Found"})

        }
    }catch(err)
    {
        res.json({"Success":false , "Message":"User not Found" , err})
        
    }
    
}


module.exports  ={
    GetUserById,
    getAllUsers,
    updateuserById,
    DeleteUserById,
    Createuser,
    disableuser,
    ableuser,
    followuserById,
    unfollowuserById,
    Login
}