import jwt from "jsonwebtoken";

const verifyToken  = (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error) {
        console.log("Invalid or expired token", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default verifyToken;