const {Router}=require("express");
const multer=require("multer")
const router=Router();

const Blog=require("../models/blog")
const Comment=require("../models/comment")


const path=require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.resolve(`./publics/uploads`) )
    },
    filename: function (req, file, cb) {
     const fileName=`${Date.now()}-${file.originalname}`;
     cb(null,fileName)
    }
  })
  
  const upload = multer({ storage: storage })



router.get('/add-new',(req,res)=>{
    return res.render("addBlog",{
        user:req.user
    })
})

router.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    // console.log(blog)
    const comment=await Comment.find({blogId:req.params.id}).populate("createdBy");
    console.log(comment)
    return res.render("blog",{
        user:req.user,
        blog:blog,
        comments:comment
    })

})

router.post("/",upload.single("image"),async(req,res)=>{
   const blog=await Blog.create({
    title:req.body.title,
    body:req.body.body,
    createdBy:req.user._id,
    coverIamgeUrl:`/uploads/${req.file.filename}`
   })
    return res.redirect(`/blog/${blog._id}`)
})

router.post('/comment/:blogId',async(req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})
module.exports=router;