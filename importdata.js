const app=require('./app');
const mongoose=require('mongoose')
const fs=require('fs');
const Tour=require('./models/tourModel');
const Review=require('./models/reviewModel');
const User=require('./models/userModel');



// const DB="mongodb://localhost:27017/natours"
const DB="mongodb+srv://babish9887:zSv5TDnxbCLfK56x@cluster0.mzljvwc.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(DB, {

}).then(()=>{
  // console.log(conn.connections)
  console.log('DB connection Successfull');
})


const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));



const importData=async ()=>{
    try{
        await Tour.create(tours)
        await Review.create(reviews)
        await User.create(users, {validateBeforeSave: false})

        console.log('data successfully loaded');
        process.exit();
    }catch(err){    
        console.log(err)
    }
};


const deleteData=async ()=>{
    try{
        await Tour.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();

        console.log('data successfully Deleted');
        process.exit();
    }catch(err){    
        console.log(err)
    }
};

if(process.argv[2]==='--import'){
    importData()
}else if(process.argv[2]==='--delete'){
    deleteData();
}
