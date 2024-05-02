import { connect } from "mongoose";
const config ={
db_uri: process.env.DATABASE_URI || "mongodb+srv://hammadbro6:lMs8907@cluster0.4r05eyw.mongodb.net/?retryWrites=true&w=majority"}
 const callDb= async()=>{
    try{
        await connect(config.db_uri)
        console.log ('DB Connected')
    }catch (e) {
        console.log(e)
    }
 }
 export {callDb,config};