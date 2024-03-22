const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://atulitgaur:sanjayashaS28@cluster0.zbmbdhh.mongodb.net/chat-ba"

const connectToMongo = async() =>{
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to Mongo successfully')
    }
    catch(error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo;