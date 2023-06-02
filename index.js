// code to create server using express

// import the express
const express = require('express')

// import cors
const cors=require('cors')
const { json } = require('express')

// import jsonwebtoken
const jwt=require('jsonwebtoken')

// import logic file
const logic=require('./services/logic')

//create server using express
const server = express()

// use cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

// use express.json()- to parse json content
server.use(express.json())




// setup port for server app
server.listen(3000,()=>{
    console.log('bank app started at port number 3000');
})



// BANK SERVER SIDE - request resolve

// middleware for verify token to check user is logined or not

const jwtMiddleware=(req,res,next)=>{
    console.log('jwtMiddleware-router specifier');
    // get token from request header
    const token=req.headers['verify-token']
    console.log(token);
    try{
        //verify  token -verify()
    const data=jwt.verify(token,'superseceretkey12345')
    console.log(data);
    // to get login account number

    req.currentAcno=data.loginAcno
    
    // to process client req
    next()
    }
    catch{
        res.status(401).json({message:'please Login...'})
    }
}

// register - POST request can be used to post the data to be stored or created
server.post('/register',(req,res)=>{
    console.log('inside register api');
    console.log(req.body);

// call register function for logic
logic.register(req.body.acno,req.body.username,req.body.password)
.then((result)=>{

    // response send to client
      res.status(result.statusCode).json(result)

})

  
})


// login
server.post('/login',(req,res)=>{
    console.log('inside login api');
    console.log(req.body);

// call login function for logic
logic.login(req.body.acno,req.body.password)
.then((result)=>{
    res.status(result.statusCode).json(result)
})
})

// balance enquiry
// router specifier middleware
server.get('/get-balance/:acno',jwtMiddleware,(req,res)=>{
    console.log('inside get balance');
    console.log(req.params);
    // call login logic
    logic.getBalance(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// fund transfer
// router specifier middleware

server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
    console.log('inside fund transfer api');
    console.log(req.body);
    // call login logic
    logic.fundTransfer(req.currentAcno,req.body.pswd,req.body.toAcno,req.body.amount)
    .then((result)=>{
        // response send to client

        res.status(result.statusCode).json(result)
    })
})

// transaction 
server.get('/all-transaction',jwtMiddleware,(req,res)=>{
    console.log('inside transaction api');
    console.log(req.params);
    // call login logic
    logic.allTransaction(req.currentAcno)
    .then((result)=>{
        // response send to client

        res.status(result.statusCode).json(result)
    })
})

// deleteMyAccount
server.delete('/delete-my-account',jwtMiddleware,(req,res)=>{
    console.log('inside delete account api');
    logic.deleteMyAccount(req.currentAcno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})


