const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert} = require('html-to-text'); // Import htmlToText properly
// new Email(user, url).sendWelcome();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'hello@jonas.io';
  }

  newTransport() {
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '7c07a1e2079008',
        password: '33547f9663cbcf',
      },
      authMethod: 'PLAIN',
    });
  }
  
  async send(template, subject) {
    // 1) render html based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const options = {
        wordwrap: 130,
        // ...
      };
    
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text:convert(html, options), // Use htmlToText properly
    };
    
    // 2) create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  
  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }


  async sendPasswordReset(){
    await this.send('passwordReset','Your password reset token (valid for only 10 minutes');
  }
};


// const sendEmail = async options => {
//   // Create Transporter
//   // Define the email options
 
//   // Actually send the email
//    transporter.sendMail(mailOptions, function(err) {
//     if (err) console.log("Some Error",err.message);
//     else console.log('email sent successfully');
//   });
// };

// module.exports = sendEmail;
