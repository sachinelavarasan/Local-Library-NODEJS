const express = require('express')

const mongoose = require('mongoose')

const methodOverride = require('method-override');


const blogrouter = require('./routes/blogs')

const Blog = require('./models/blog')

const app = express()

//connect db
mongoose.connect('mongodb://localhost/blogs',{
     useNewUrlParser: true ,
     useUnifiedTopology: true
});



app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));

app.use(methodOverride('_method'));

app.set('view engine' , 'ejs');

app.get('/',async(req,res)=>{
   let blogs =await Blog.find().sort({time:"desc"})

    res.render("index",{sample:blogs});    

})


app.use('/blogs',blogrouter);

app.listen(5000);