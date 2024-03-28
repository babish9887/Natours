const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// const DB = 'mongodb://localhost:27017/natours';
const DB="mongodb+srv://babish9887:zSv5TDnxbCLfK56x@cluster0.mzljvwc.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0"

mongoose
  .connect(DB, {
  })
  .then(() => {
    console.log('DB connection Successfull');
  });

app.listen(3000, () => {
  console.log('start listening...');
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  // server.close(() => {
  //   process.exit(1);
  // });
});
