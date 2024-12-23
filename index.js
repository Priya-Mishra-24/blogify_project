const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const mongoose=require("mongoose");
const Blog=require("./models/blog")
const userRoute=require("./routes/user")
const blogRoute=require("./routes/blog")

const{checkForAuthentication}=require("./middlewares/authentication")
const app=express();
const PORT=8000;

mongoose.connect("mongodb://localhost:27017/blogify").then((e)=>{
    console.log("mongodb connected")
})
app.set('view engine',"ejs");
app.set('views',path.resolve("./views"));



app.use( express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication("token"))
app.use(express.static(path.resolve("./publics")))

app.use("/user",userRoute);
app.use("/blog",blogRoute);
app.listen(PORT,()=>console.log(`Server Started at Port: ${PORT}`))

app.get('/',async(req,res)=>{
    const allBlogs=await Blog.find({})
    res.render("home",{
        user:req.user,
        blogs:allBlogs
    })
    
})


