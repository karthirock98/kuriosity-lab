// Silence is Golden
import express from 'express';
import auth_routers from './src/routes/auth-routes.js';
const app_init = express()

app_init.use(express.json())
app_init.use(express.urlencoded({extended: true}))

app_init.use('/auth',auth_routers)

app_init.listen(3333,()=>{
    console.log("Listening the Server", new Date());  
})