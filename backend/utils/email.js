// backend/utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function sendOrderConfirmationEmail(to, order) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Mellophi Fashion <noreply@mellophi.co.za>',
        to,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `<h2>Thank you for your order!</h2>
               <p>Your payment was successful. Here are your order details:</p>
               <ul>
                 <li><strong>Order Reference:</strong> ${order.orderNumber}</li>
                 <li><strong>Total:</strong> R${(order.subtotal + order.shippingCost - order.discount).toFixed(2)}</li>
               </ul>
               <p>We will process your order soon.</p>`
    };
    return transporter.sendMail(mailOptions);
}

module.exports = { sendOrderConfirmationEmail };
