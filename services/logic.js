// import db.js
const { response }= require('express')
const db=require('./db')

// import jsonwebtoke
const jwt=require('jsonwebtoken')

// register
const register=(acno,username,password)=>{

    // logic to resolve register(acno,username,password)
    console.log('inside register logic');
    // check acno in db -findOne() - asynchronous function :promise
    return db.User.findOne({
        acno
    }).then((response)=>{
        console.log(response);
        if(response){
            // acno already exist
            return{
                statusCode:401,
                message:"Account already exist"
            }
        }
        else{
            // acno not in db,so register it
            const newUser =new db.User({
                acno,
                username,
                password,
                balance:5000,
                transaction:[]
            })
            // to use newuser in mongodb
            newUser.save()
            // send response as register success
            return{
                statusCode:200,
                message:"Register successfully"
            }
        }
    })
}

// login logic 
const login=(acno,password)=>{

    console.log('inside login logic');
    // 1.check acno and password in db
    return db.User.findOne({
        acno,
        password
    }).then((result)=>{
        if(result){
        // acno present in db 

        // generate the commant for token with payload as acno
        const token=jwt.sign({
            loginAcno:acno
        },'superseceretkey12345'
        )

        return {
            statusCode:200,
            message:"Login successfull...",
            // send username to client
            currentUser:result.username,
            // send token to client
            token,
            // send acno
            currentAcno:acno
        }
    }
        else{
            // acno not present in db 
            return{
                statusCode:404,
                message:"invalid Account Number or Password"
            }
        }
    })
}

// logic for balance enquiry 

const getBalance=(acno)=>{
// 1.check acno in mongodb

return db.User.findOne({acno}).then((result)=>{
    
    if(result){
        return{
            statusCode:200,
            balance:result.balance
        }

    }
    else{
        return{
            statusCode:400,
            message:"invalid Account number"
        }
    }
})

}

// logic for fund transfer
const fundTransfer=(fromAcno,fromAcnopswd,toAcno,amt)=>{
    // convert amt to number
    let amount=parseInt(amt)

    // check fromacno in db
    return db.User.findOne({
        acno:fromAcno,
        password:fromAcnopswd
    }).then((debitDetails)=>{
        //to block self transfer request
        if(fromAcno==toAcno){
            return{
                statusCode:401,
                message:"operation denied"
            }
        }
        if(debitDetails){
       // result -fromacno details
    //    check toacno in db

       return db.User.findOne({
        acno:toAcno
       }).then((creditDetails)=>{
        if(creditDetails){

            // creditdetails -to acno details
            // check fromacno has balance
            if(debitDetails.balance>=amount){
                // sufficient balance in fromacno
                // update fromacno
                debitDetails.balance -= amount
                debitDetails.transaction.push({
                    type:"DEBIT",
                    amount,
                    fromAcno,
                    toAcno
                })
                // tosave changes in mongodb

                 debitDetails.save()

                // update toacno

                creditDetails.balance+=amount
                creditDetails.transaction.push({
                    type:"CREDIT",
                    amount,
                    fromAcno,
                    toAcno
                })
                // to save change in mongodb
                 creditDetails.save()
                // send response to client
                return{
                    statusCode:200,
                    message:"yeh!!!  successfully transfered ..."
                }

            }
            else{
            
                    return{
                        statusCode:404,
                        message:"insufficient balance..."
                    }
                
            }
        }
        else{
            return{
                statusCode:404,
                message:"invalid credit account credentials"
            }
        }
       })


        }
else{
    return{
        statusCode:404,
        message:"invalid debit account credentials"
    }
}

    })


}

// transaction history 
const allTransaction =(acno)=>{

    // 1.check acno in db

    return db.User.findOne({
        acno
    }).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transaction:result.transaction
            }

        }
        else{
            return{
                statusCode:404,
                message:"invalid Account"
            }
        }
    })

}
// delete  my account
const deleteMyAccount=(acno)=>{
// delete from acno
return db.User.deleteOne({
    acno
}).then((result)=>{
    return{
        statusCode:200,
        message:"Your Acoount is Deleted from database...Please Wait!!!"
    }
})

}

// export register

module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    allTransaction,
    deleteMyAccount
}