const express = require('express');
const fs = require('fs');

const Blog = require("./../models/blog");

const router =express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }

});

const upload = multer({ 
  storage: storage,
  limits : {
    fieldSize: 1024*1024*3
  },
 })

router.get('/new',(req,res)=>{
  res.render("new");
});

//read particular id data
router.get('/:slug',async(req,res)=>{
  blog = await Blog.findOne({slug:req.params.slug});
  if(blog){
    res.render('view',{blog:blog});
  }
  else{
    res.redirect('/');
  }


});


//new post section

router.post('/',upload.single('image'),async(req,res)=>{
  //console.log(req.body);
  let blog = new Blog({
    title:req.body.title,
    author:req.body.author,
    description:req.body.description,
    img:req.file.filename,

  });
  try{
    blog = await blog.save();
    //redirect for particulr data
    res.redirect(`blogs/${blog.slug}`);
  }catch(err){
    console.log(err);
  }

});

//edit section

router.get('/edit/:id',async(req,res)=>{
  let blog = await Blog.findById(req.params.id);
  if(blog){
    res.render('edit',{blog:blog});
  }
  
});

router.put('/:id', upload.single('image'),async (req, res) => {
  

  req.blog = await Blog.findById(req.params.id);
  let blog = req.blog;
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.description = req.body.description;
  console.log(blog.img)
  
  fs.unlink("./public/uploads/"+blog.img,(err)=>{
  if(err)
  {
    console.log(err)
  }
  console.log("Deleted");
  });
  blog.img = req.file.filename;

  try {
    blog = await blog.save();
    //redirect to the view route
    res.redirect('/blogs/${blog.slug}');
  } catch (error) {
    console.log(error);
    res.redirect('/blogs/edit/${blog.id}', { blog: blog });
  }
});

//delete section

router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/');
});





module.exports = router;