let jwt = require("jsonwebtoken");
let dotenv = require("dotenv");

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const userAdmin = (req, res, next) => {
    if (req.headers["authorization"]) {
        const token = req.headers["authorization"].split(" ")[1];
        const payload = jwt.verify(token, SECRET_KEY);
        let roles = [
            1000, 2000
        ]
        if (roles.includes(payload.role_id)) {
            const decode = jwt.decode(token);
            console.log("decode", decode)
            req.user = decode;
            next();
        } else if (payload.role_id === 4000) {
            res.status(401).json({
                error: true,
                message: "You are not authorized to access this resource",
                data: null,
            });
        } else if (payload.role_id === 3000) {
            res.status(401).json({
                error: true,
                message: "You are not unauthorized to access this resource",
                data: null,
            });
        }
    } else {
        res.status(401).json({
            error: true,
            message: "Not Authorized",
            data: null,
        });
    }
};


module.exports = {
    userAdmin,
};
