import jwt from "jsonwebtoken";

// middleware for authenticate user

// this middleware is responsible for user login or not login when user is not logged in user not created the todo list etc

async function auth(req, res, next) {
    try {
        // get token from cookie  get token from client side (in this case it is cookie)
        const token = req.cookies.token;
        // if token not found then return unauthorized  check if token is provided in request
        if (!token) {
            return res.status(400).json({ 
                success: false,
                message: "unauthorized, please login" });
        }
        // verify token  verify if token is valid (this fucton use for compare tokens)
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        // if token is not valid then return unauthorized  if token is valid then continue to next middleware
        if(!decoded){
            return res.status(400).json({ 
                success: false,
                message: "unauthorized, please login" });
        }
        // this id we sent then  token generated  
        req.userId = decoded.userId;
        next();
    } catch (error) {
        
        res.status(400).json({ success: false, message: "token is not valid" });
    }

};

export default auth;