import express from "express"
import session from "express-session"
import passport from "passport"
import path from "path"
import fs from "fs"
import bcrypt from "bcrypt"
import passportLocal from "passport-local"


const app = express()


app.use((req,res,next) => next())
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:process.env.SECRET,
    cookie:{maxAge:6000},
    saveUninitialized:false,
    resave:false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal.Strategy({
    usernameField:"email"
},async(email,password,done) => {
    await fs.promises.readFile(path.resolve("data.json"),"utf-8")
    .then((resp) => JSON.parse(resp))
    .then(async (users) =>{
        const user = users.find((user) => user.email === email)
        if(user === undefined) {
            return done(null,null,{message:"incorect email"})
        }

        if(await bcrypt.compare(password,user.password)) {
            return done(null,user)
        }

        done(null,null,{message:"incorrrecn Date"})
    })
}))

passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser(async(id,done) => {
    await fs.promises.readFile(path.resolve("data.json"),"utf-8")
    .then((resp) => JSON.parse(resp))
    .then((users) => done(null,users.find((user) => user.id === id)))
})


// app.use(checkauthentic)
app.get("/",checkauthentic,(req,res) => {
    res.sendFile(path.resolve("public/main.html"))
})

app.get("/register",checkNotauthentic,(req,res) => {
    res.sendFile(path.resolve("public/register.html"))
})

app.get("/login",checkNotauthentic,(req,res) => {
    res.sendFile(path.resolve("public/login.html"))
})

app.get("/logout",(req,res) => {
    req.logOut()
    res.redirect("/login")
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login"
}))

app.post("/register",async(req,res) => {
    const {name,email,password} = req.body
    const bcryptPassword = await bcrypt.hash(password,10)

    await fs.promises.readFile(path.resolve("data.json"),"utf-8")
    .then((data) => {data === "" ? data=[] : data=JSON.parse(data);return data})
    .then((data) => {
        data.push({
            id:`${Date.now()}_${Math.random()}`,
            name,email,password:bcryptPassword
        })
        fs.promises.writeFile(path.resolve("data.json"),JSON.stringify(data,undefined,2))
    })
    res.redirect("/login")
})

function checkauthentic(req,res,next) {
    console.log(req.isAuthenticated())
    if(req.isAuthenticated() === false) {
        return res.redirect("/register")
    }
    next()
}

function checkNotauthentic(req,res,next) {
    if(req.isAuthenticated() === true) {
        return res.redirect("/")
    }
    next()
}



// CRUD 
app.get("/get",(req,res) => {
    res.send({name:"varujan",LastName:"gexahovit",method:"GET"})
})

app.post("/post",(req,res) => {
    res.send({name:"varujan",LastName:"gexahovit",method:"GET",...req.body})
})

app.get("/getid/:id",(req,res) => {
    let putData =  [
        {id:55,name:"varujan",LastName:"gexahovit",method:"GETIId"},
        {id:7,name:"varujan",LastName:"gexahovit",method:"GETId"},
        {id:1,name:"varujan",LastName:"gexahovit",method:"GETId"}
    ]
    const obj = putData.find((val) => val.id === +req.params.id)
    res.send(obj)
})

app.put("/put/:id",(req,res) => {
    let putData =  [
        {id:55,name:"varujan",LastName:"gexahovit",method:"GETIId"},
        {id:7,name:"varujan",LastName:"gexahovit",method:"GETId"},
        {id:1,name:"varujan",LastName:"gexahovit",method:"GETId"}
    ]
    const obj = putData.map((val) => {
        if(+req.params.id === val.id) {
            return {
                ...val,
                ...req.body
            }
        }
        return val
    })
    res.send(obj)
})


app.delete("/delete/:id",(req,res) => {
    let putData =  [
        {id:55,name:"armen",LastName:"gexahovit",method:"GETIId"},
        {id:7,name:"vardan",LastName:"gexahovit",method:"GETId"},
        {id:1,name:"varujan",LastName:"gexahovit",method:"GETId"}
    ]
    const obj = putData.filter((val) => val.id !== +req.params.id)
    res.send(obj)
})

app.get("/query",(req,res) => {
    let putData =  [
        {id:55,name:"armen",LastName:"gexahovit",method:"set"},
        {id:7,name:"vardan",LastName:"gexahovit",method:"get"},
        {id:1,name:"varujan",LastName:"gexahovit",method:"query"}
    ]
    const obj = putData.find((val) =>{
        return  val.name === req.query.name || val.method === req.query.method
    })
    res.send(obj)
})


app.listen(process.env.PORT)