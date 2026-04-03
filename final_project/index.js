import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { authenticated as customer_routes } from './router/auth_users.js';
import { general as genl_routes } from './router/general.js';

const app = express();

app.use(json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const accessToken = req.session?.authorization?.accessToken;
    if (!accessToken) {
        return res.status(401).json({ message: "User not logged in" });
    }

    try {
        const decoded = jwt.verify(accessToken, "access");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "User not authenticated" });
    }

});
 
const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
