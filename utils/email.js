const nodemailer = require('nodemailer');
require('dotenv').config();
const pug=require('pug')
const { convert} = require('html-to-text'); // Import htmlToText properly


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD
    },
});

const sendEmail = async options => {
  const html = pug.renderFile(`${__dirname}/../views/email/${options.template}.pug`, {
    firstName: options.firstName,
    url: options.url,
    subject: options.subject,
  });
  const convertOptions = {
    wordwrap: 130,
  };

    const mailOptions = {
        from: {
            name: 'Babish',
            address: 'babish9887@gmail.com'
        },
        to:  [`${options.email}`],
        subject: options.subject,
        text: convert(html, convertOptions)
        // text: options.text
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log('Email sent Successfully')
    } catch (err){
        console.error('Error sending email:', err);
    }
}
module.exports = sendEmail;