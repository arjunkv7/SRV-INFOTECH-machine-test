const mongoClient=require('mongodb').MongoClient

const state={
    db:null
}

module.exports.connect = function(done){
    const url="mongodb://localhost:27017"
    const dbname='srv'

     mongoClient.connect(url).then((data)=>{
        // if(err) return done(err)
         state.db=data.db(dbname)
        done()
    }).catch((err)=>{
        console.log(err)
    })
  }
module.exports.get=function(){
    return state.db
}
