const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

 

mongoose
  .connect(process.env.MONGO,{
    useNewUrlParser :true,
    useUnifiedTopology:true,
  })
  .then(() => console.log("MongoDB is Connected Succesfully"))
  .catch((err) => console.error(err));

// const jwtSecret = process.env.JWT_SECRET;c
const userSchema = new mongoose.Schema({
    username :String,
    email : String,
    password : String,
});
const User = mongoose.model('User', userSchema);


app.post('/sign-up',async(req,res)=>{
  const {username ,email,password}= req.body;
  const hashedPassword = await bcrypt.hash(password,10);
  const user = new User({username , email , password:hashedPassword});
  await user.save();
  res.status(201).send('User created');
});

app.post('/sign-in', async(req,res)=>{
const {email,password}= req.body;

const user = await User.findOne({email});
if(!user)return res.status(404).send('User not Found');

const isMatch = await bcrypt.compare(password,user.password);
if(!isMatch) return res.status(400).send('Wrong Credentials');

const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:'1h'});

res.json({token});


})

app.listen(5000,()=>{
    console.log('Server running on port 5000');
})