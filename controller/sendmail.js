const nodemailer = require('nodemailer');
function mail(verify,user){
    const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'eladio.crist37@ethereal.email',
                pass: 'pqQjJYzVF1wTut3Jnj'
            }
        });
        const info = transporter.sendMail({
            from: '"Server 👻" <eladio.crist37@ethereal.email>', // sender address
            to: user, // list of receivers
            subject: "Verify your account", // Subject line
            text: verify, // plain text body
            html: `<a href=${verify}>Click to verify</a>`, // html body
        });
}

module.exports = {mail};