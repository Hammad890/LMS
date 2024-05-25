import { connect } from "mongoose";
import 'dotenv/config';
 const callDb= async()=>{
    try{
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error('MONGO_URL is not defined');
        }
        await connect(mongoUrl);
        console.log('DB Connected');
    } catch (e) {
        console.log(e);
    }
 }
 export {callDb};