var db = require('../config/connection')
var collections = require("../config/collections")
var bcrypt = require("bcryptjs")
const async = require('hbs/lib/async')
const jwt = require("jsonwebtoken");
const keys = require('../config/keys');
const { response } = require('express');
var xlsx = require("xlsx")

module.exports = {
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {
            let Password = await bcrypt.hash(userData.password, 10)
            userData['email'] = userData['email'].toLowerCase()


            db.get().collection(collections.USER_COLLECTION).insertOne(
                {
                    user_name: userData.fullName,
                    email: userData['email'],
                    mobile_number: userData.mobileNumber,
                    qualification: userData.qualification,
                    city: userData.city,
                    password: Password

                }).then((data) => {
                    console.log(data + "data inserted successfully")
                    resolve(data)
                }).catch((err) => {
                    console.log(err)
                })
        })
    },

    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {

            let allUsers = await db.get().collection(collections.USER_COLLECTION).find().toArray()
            console.log(allUsers)
            resolve(allUsers)
        })
    },

    removeUser: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).deleteOne({ email: user }).then((data) => {
                console.log(data)
                resolve()
            }).catch((err) => {
                console.log(err)
            })
        })
    },

    validateLoginDetails: (loginDetails) => {
        return new Promise(async (resolve, reject) => {
            if (!loginDetails.email && loginDetails.password) {
                reject({ err: 'All fields required' })
            }

            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: loginDetails.email })
            console.log(user)

            if (user) {
                bcrypt.compare(loginDetails.password, user.password, (err, data) => {
                    if (data == false) {
                        console.log(err)
                        reject({ err: 'Wrong password' })
                    }
                    
                    console.log(data)
                    resolve(user)
                })
            }
            else if(user == null){
            reject({err:"Wrong Email"})
            }
        })
    },

    getToken: (user) => {

        console.log(user)
        let userDetails =
        {
            user_name: user.user_name,
            email: user.email,
            mobile_number: user.mobile_number,
            qualification: user.qualification,
            city: user.city
        }
        const token = jwt.sign(userDetails, keys.SECRET_KEY)
        console.log(token)
        user.token = token

        return token;

    },

    getDetails: (user) => {
        return new Promise(async (resolve, reject) => {
            let userDetails = await db.get().collection(collections.USER_COLLECTION).findOne({ email: user.email, mobile_number: user.mobile_number })
            if (userDetails) resolve(userDetails)
        })
    },

    editProfile: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email:userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password,(err,data) => {
                    console.log(data + err)
                    if (data == false || 0) {
                        console.log(err)
                        reject({ err: 'Wrong password' })
                    }
                    else{
                    db.get().collection(collections.USER_COLLECTION).updateOne({ email: userData.email },
                        {
                            $set: {
                                user_name: userData.fullName,
                                mobile_number: userData.mobileNumber,
                                qualification: userData.qualification,
                                city: userData.city,
                            }
                        }, (err, data) => {
                            if (err) console.log(err)

                            console.log(data)
                            resolve()
                        })
                    }
                })
            }
        })
    },

    getUserFile : async()=>{
         return new Promise(async(resolve,reject)=>{
            let allUsers = await db.get().collection(collections.USER_COLLECTION).find().project({_id:0,password:0}).toArray()
         
            console.log(allUsers)

            const workSheet = xlsx.utils.json_to_sheet(allUsers);
            const workBook = xlsx.utils.book_new();

            xlsx.utils.book_append_sheet(workBook,workSheet,"users")

            xlsx.write(workBook,{bookType:'xlsx',type:'buffer'})

            xlsx.write(workBook,{bookType:"xlsx",type:'binary'})

            xlsx.writeFile(workBook,"usersData.xlsx")
            var file = "usersData.xlsx"
            resolve(file)
         })
    }
}