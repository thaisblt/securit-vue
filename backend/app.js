import cookieParser from 'cookie-parser';
import express from 'express';
import path, { matchesGlob } from 'path';
import prisma from './prisma.js'
import {sendMail} from './mail.mjs'
import { getRandomCode } from './utilities.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const app = express();
const email2code = {};

app.use(express.json())
app.use(cookieParser())


// Se connecter => Vérifier l'authentification (mail dans BD et password ok)

app.post('/api/check_login', async(req, res) => {
    const { email, password } = req.body;
    const user = await prisma.User.findUnique({
        where : {email}
    })

    if (user) {
        if (await bcrypt.compare(password, user.password)) { 
            const code = getRandomCode().toString();
            email2code[email] = code;
            //await sendMail({
            //to: email,
            //subject:'code de vérification',
            //html:`Code à entrer : ${code}`,
            //});
            console.log({email2code});
            res.cookie('codeWait','code60s', {maxAge:60000});
        res.sendStatus(200)
            
        } else {
        res.sendStatus(403)
        }
    } else {
        res.sendStatus(403)
    }
});
// Se connecter : Verifier le code
app.post('/api/check_login_code', async (req, res) => {
    const { email, code } = req.body;
    //let attempts = req.body.attempts;
    const user = await prisma.User.findUnique({
        where: {email}
    }); 
    const name = user.name;
    console.log(email2code);

    //if (attempts < 2) {
        //if (req.cookies.codeWait) {
            if (code === email2code[email]) { 
            const token = jwt.sign(
                { sub: user.id },
                process.env.SECRET
            );
            res.cookie('session_token', token, {httpOnly: true, maxAge: 3600 * 1000});
            res.sendStatus(200);
            } else {
            //attempts ++;
            res.sendStatus(403);
            }
        //} else {
            //res.sendStatus(403);
        //}
    //} else {
        //res.render('login_verify', {email, error_message:"Plus de 3 tentatives incorrectes", attempts});
    //}
});

// Créer un compte : Vérifier si le mail existe
app.post('/api/check_register', async(req, res) => {
    const email = req.body.email.toLowerCase();
    const userList = await prisma.User.findMany({
        where : {email}
    })
    console.log('userList', userList)

    if (userList.length === 0) {   // mail envoyé que si aucun user de ce mail existe.
        const code = getRandomCode().toString();
        email2code[email] = code;
        await sendMail({
            to: email,
            subject:'code de vérification',
            html:`Code à entrer : ${code}`,
        });
        console.log({email2code});
    } 
    res.cookie('codeWait','code60s', {maxAge:60000});
    res.sendStatus(200); 
});

// Créer un compte => Vérifier le code reçu
app.post('/api/check_register_code', (req, res) => {
   const { email, code } = req.body;
   //let attempts = req.body.attempts;
   console.log(email2code);
   console.log(email);
   console.log(req.cookies.codeWait);
   //console.log(attempts);

    //if (attempts < 2) {
        if (req.cookies.codeWait) {
            if (code === email2code[email]) { 
            res.sendStatus(200);
            } else {
            //attempts ++;
            res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    //} else {
    //    res.sendStatus(403);
    //}
});

// Créer un compte => Verifier que les mdp sont valides et ajouter l'utilisateur à la BD si info ok
app.post('/api/check_name_password', async(req, res) => {   
    const { email, name, password1, password2 } = req.body;
    if (password1 === password2) {
        const hashedPassword = await bcrypt.hash(password1, 4)
        await prisma.User.create({data: {
            name, 
            email, 
            password : hashedPassword}});
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }  
});


// ICI MIDDLEWARE DE PROTECTION ???

// Récupérer tous les visites en JSON
app.get('/api/visits', async (req, res) => {
    const visits = await prisma.Visit.findMany({
        include: {
            company: true,
            inspector: true
        },
        orderBy: {
            date: 'desc'
        }
    })
    res.json({ visits })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

