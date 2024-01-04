const express = require('express');
const router = express.Router();
const UserController = require("../Controllers/UserController")
const NoteController= require("../Controllers/NoteController")
const Middleware= require("../Middlewares/Auth")



router.post("/register",UserController.CreateUser)
router.post("/login",UserController.loginUser)
router.post('/Notes',NoteController.createNote)
router.get('/Notes',Middleware.authentication,NoteController. getNotesQuery )
router.get('/Notes/:NoteId',Middleware.authentication,Middleware.authorisation,NoteController. getNoteById)
router.put('/Notes/:NoteId',Middleware.authentication,Middleware.authorisation,NoteController.updateNote)
router.delete('/Notes/:NoteId',Middleware.authentication,Middleware.authorisation,NoteController.deleteNote)





module.exports=router;