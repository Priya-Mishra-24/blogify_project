const {Router}=require("express");
const user=require("../models/user")
const router=Router();

router.get('/signup',(req,res)=>{
    res.render("signup");
})

router.get('/signin',(req,res)=>{
    res.render("signin");
})

router.post('/signup',async(req,res)=>{
    const{fullname,Email,Password}=req.body;
    // console.log(req.body)
    await user.create({
        fullName:fullname,
        email:Email,
        password:Password
    })

    return res.redirect("/");
})

router.post('/signin',async(req,res)=>{
    const{Email,Password}=req.body;
    try{

        const token=await user.matchPasswordAndGenerateToken(Email,Password);
        return res.cookie("token",token).redirect("/")
    }catch(error){
        return res.render("signin",{
            error:"Invalid Email Or Password"
        });
    
    }

})

router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/")
})
module.exports=router;