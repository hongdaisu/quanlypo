require('dotenv').config();
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';


let sendsimpleEmail = async (dataSend) => {
    // console.log('check email:', dataSend)
    // Khởi tạo OAuth2Client với Client ID và Client Secret 
    let myOAuth2Client = new OAuth2Client(process.env.GOOGLE_MAILER_CLIENT_ID, process.env.GOOGLE_MAILER_CLIENT_SECRET, process.env.REDIRECT_URI)


    // Set Refresh Token vào OAuth2Client Credentials
    myOAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
    })

    let ACCESS_TOKEN = await myOAuth2Client.getAccessToken();
    // console.log('check ACCESS_TOKEN:', ACCESS_TOKEN)
    let myAccessToken = ACCESS_TOKEN?.token

    // console.log('check token', myAccessToken)
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_APP,
            clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
            clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
            refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
            accessToken: myAccessToken
        }
    })
    let mailOptions = {
        from: '"Fred Foo 👻" <qlcvhmdn@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "QUẢN LÝ CÔNG VĂN HMDN", // Subject line
        // text: "Hello world?", // plain text body
        html: `
        <h3>Xin chào:</h3>
        <p>Đã nhận được email</p>
        <div>
        </div>
        `,
    }
    // let mailOptions = {
    //     from: '"Fred Foo 👻" <hongdaisu@gmail.com>', // sender address
    //     to: dataSend.reciverEmail, // list of receivers
    //     subject: "QUẢN LÝ CÔNG VĂN HMDN", // Subject line
    //     // text: "Hello world?", // plain text body
    //     html: `
    //     <h3>Xin chào ${dataSend.patientName}</h3>
    //     <p>Đã nhận được email</p>
    //     <div>
    //     <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    //     </div>
    //     `,
    // }

    // Gọi hành động gửi email
    await transport.sendMail(mailOptions)
}

module.exports = {
    sendsimpleEmail: sendsimpleEmail
}