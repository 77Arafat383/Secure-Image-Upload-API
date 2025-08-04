const express = require ('express'); //Express simplifies HTTP server creation
const cors = require('cors'); //Needed to enable request from other origin
const helmet = require('helmet');  //set secure http headers.
const multer = require('multer'); //import multer for file uploading
const path = require('path'); //handle file path, core module

const app = express(); //This object handles routes and middleware

app.use(cors()) //enable API access from other domain. 
app.use(helmet()) //Adds secure headers.
app.use('/uploads',express.static(path.join(__dirname,'uploads')));


//multer configuration

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/');
    },
    filename: function(req,file,cb){
        const uniqeSuffix = Date.now() + '-'+ Math.round(Math.random()*1E9);//suffix hisabe date er sathe random number generate korbo jate unique hoy.
        cb(null,uniqeSuffix+'-'+file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {fileSize:10*1024*1024},//10MB limitation
    fileFilter: function(req,file,cb){
        if(file.mimetype.startsWith('image/')){
            cb(null,true);//only image nibe. 
        }else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

app.post('/upload',upload.single('image'),(req, res)=>{
    if(!req.file){
        return res.status(400).json({error: 'No file uploaded or invalid file type'});
    }
    res.json({
        message: 'File uploaded successfully!',
        filePath: `/uploads/${req.file.filename}`
    });
})

//Root route
app.get('/',(req, res)=>{
    res.send('Welcome to secure image upload API');
});

app.use((err,req,res,next)=>{
    console.error(err.message);
    res.status(500).json({error: err.message});
})
app.listen(3000, ()=>{
    console.log('Server running at http://localhost:3000');
});