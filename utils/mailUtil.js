const nodemailer = require("nodemailer");
require("dotenv").config()

const sendEmail = async ({
    email,
    name,
    phone,
    remarks,
    files,
    company_name,
    subject
}) => {
    let attachments
    if (files) attachments = files.map(file => {
        return {
            filename: file.originalname,
            content: file.buffer,
            encoding: file.encoding
        };
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            // user: "shashucr567@gmail.com",
            // pass: "fgfpnujlsuojhxew",
            user: process.env.SUPPORTMAIL,
            pass: process.env.APPPASS
        },
    });

    let senddescriptiondata = `Name: ${name}
    Phone no: ${phone},
    E-mail: ${email},
    ${remarks},
    ${subject},
    ${company_name}`;
    const mailOptions = {
        from: `${email} to <${email}>`,
        to: process.env.SUPPORTMAIL,
        name,
        phone,
        remarks,
        subject,
        company_name,
        text: senddescriptiondata,
        replyTo: `${email}`
    };

    try {
        const data = await transporter.sendMail(mailOptions);
        // console.log("data", data)
        return "Email sent successfully";
    } catch (error) {
        console.log(error)
        throw new Error("Something went wrong");
    }
};

const sendEmailToken = async (
    email,
    otp
) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SUPPORTMAIL,
            pass: process.env.APPPASS
        },
    });

    let senddescriptiondata = `
    E-mail: ${email},
    OTP:${otp}`;
    const mailOptions = {
        from: process.env.SUPPORTMAIL,
        to: email,
        subject: 'Taxsure Login OTP Verification',
        text: senddescriptiondata,
        replyTo: `${email}`
    };

    try {
        const data = await transporter.sendMail(mailOptions);
        console.log("data", data)
        return "Email sent successfully";
    } catch (error) {
        console.log(error)
        throw new Error("Email is not registered. Please sign up first.");
    }
};


module.exports = {
    sendEmail,
    sendEmailToken
};
