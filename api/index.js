const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = require('./models/User');
const Post = require('./models/Post');
const jwt = require('jsonwebtoken')
const app = express(); 
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');


const salt = bcrypt.genSaltSync(10);
const secret = 'sbdabsdjk'

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser())

mongoose.connect(
  'mongodb+srv://blog:BVwH7lyOqdKhk05f@cluster0.smhefqx.mongodb.net/?retryWrites=true&w=majority'
);


app.post('/register', async (req,res) => {
    const {username,password} = req.body;
    try{
      const userDoc = await User.create({
        username,
        password:bcrypt.hashSync(password,salt),
      });
      res.json(userDoc);
    } catch(e) {
      console.log(e);
      res.status(400).json(e);
    }
  });


app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  console.log(userDoc)
  const passOk = bcrypt.compareSync(password, userDoc.password);
  // res.json(passOk)
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });

});
 

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});


app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  // 
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);
  // res.json({ext})
  // const {token} = req.cookies;
  // jwt.verify(token, secret, {}, async (err,info) => {
  //   if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      // author:info.id,
    });
    res.json(postDoc);
  // });

});

app.listen(4000);
