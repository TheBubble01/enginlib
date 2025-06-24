const nodemailer = require('nodemailer');

// Test email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',  // Change to your email service
  auth: {
    user: 'emjaay001@gmail.com',       // Your email
    pass: 'rcil bcbz lnjn xdqh',        // Your email password
  }
});

transporter.sendMail({
  to: 'dederimubarak@gmail.com',  // Test email recipient
  subject: 'Test Email',
  text: 'This is a test email from nodemailer.'
}, (err, info) => {
  if (err) {
    console.error('Error sending test email:', err);
  } else {
    console.log('Test email sent successfully:', info);
  }
});

