var db = require('../config/connection')
var collections = require("../config/collections")
var bcrypt = require("bcryptjs")
const async = require('hbs/lib/async')

module.exports = {
    doSignUp : (userData)=>{
        return new Promise(async(resolve,reject)=>{
            let Password = await bcrypt.hash(userData.password,10)
            userData['email'] = userData['email'].toLowerCase()
               

          db.get().collection(collections.USER_COLLECTION).insertOne(
            {
                user_name: userData.fullName,
                email: userData['email'],
                mobile_number: userData.mobileNumber,
                qualification : userData.qualification,
                city : userData.city,
                password : Password

            }).then((data)=>{
                console.log(data + "data inserted successfully")
                resolve(data)
            }).catch((err)=>{
                console.log(err)
            })
        })
    },

    getAllUsers :()=>{
        return new Promise(async(resolve,reject)=>{

           let allUsers = await db.get().collection(collections.USER_COLLECTION).find().toArray()
           console.log(allUsers)
           resolve(allUsers)
        })
    },

    removeUser :(user)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTION).deleteOne({email:user}).then((data)=>{
                console.log(data)
                resolve()
            }).catch((err)=>{
                console.log(err)
            })
        })
    }
}