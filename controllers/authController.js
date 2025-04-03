const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const userModel = require("../models/userModel");

let dotenv = require("dotenv");
const { sendEmailToken } = require("../utils/mailUtil");
const { generateOTP } = require("../utils/otputil");
const { encrypt } = require("../utils/encrypt");

dotenv.config();
const secretKey = process.env.SECRET_KEY;

const signUp = async (req, res, next) => {
    try {
        let { first_name, last_name, email_id, company_id, role_id } = req.body;
        email_id = email_id.toLowerCase();
        const isUserExists = await userModel.findOne({ where: { email_id: email_id } });
        if (isUserExists) {
            res.status(409).json({
                error: true,
                message: "User Email already used..",
                data: null,
            });
        } else {
            await sequelize.transaction(async (transaction) => {
                let userResponse = await userModel.create(
                    {
                        first_name, last_name, email_id,
                        company_id,
                        role_id
                    },
                    { transaction }
                );

                res.status(200).json({
                    error: false,
                    message: "Registered Successfully",
                    data: userResponse,
                });
            });
        }
    } catch (err) {
        console.log("error", err);
        next(err)
    }
};

//----------------------------------------------------------------------------------------

const mailValidationAPi = async (req, res, next) => {
    try {
        const { email_id } = req.body;
        const userData = await userModel.findOne({ where: { email_id } });

        if (!userData) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: 'User email does not exist.',
                data: null
            });
        }

        // Generate OTP
        const otpCode = generateOTP(4); // Generate a 6-digit OTP
        // Send OTP to user via email
        await sendEmailToken(email_id, otpCode);
        // Store OTP in the database or a temporary store
        userData.otp = otpCode;
        await userData.save();
        res.status(200).json({
            error: false,
            message: "OTP Sent to your Mail"
        })
    } catch (error) {
        next(error)
    }
}

//----------------------------------------------------------------------------------------


const signIn = async (req, res, next) => {
    try {
        let email_id = req.body.email_id.trim().toLowerCase(); // Normalize email
        const otp = req.body.otp.toString(); // Convert OTP to string

        // Add debug logging
        console.log('Attempting login with:', { email_id, otp });

        let user = await userModel.findOne({ where: { email_id, otp } });

        // Debug log the found user
        console.log('Found user:', user);

        if (user) {
            const { id, first_name, last_name, email_id, company_id, role_id, is_active } = user;
            if (is_active === false) return res.status(403).json({
                error: true,
                message: "You Can't Loging without Admin Make You Active",
                data: null,
            });
            const payload = { id, first_name, last_name, email_id, company_id, role_id, is_active };
            const token = jwt.sign(payload, secretKey, {
                // expiresIn: "30d"
            });
            // user.otp = null;
            // await user.save();
            const encryptResponse =await encrypt(token)
            res.status(200).json({
                data: encryptResponse,
            });
        } else {
            res.status(401).json({
                error: true,
                message: "Invalid OTP",
                data: null,
            });
        }
    } catch (err) {
        console.log("error", err);
        next(err)
    }
};

module.exports = {
    signUp,
    mailValidationAPi,
    signIn,
};
