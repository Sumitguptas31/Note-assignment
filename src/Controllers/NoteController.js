const NoteModel = require("../Models/NoteModel");
const UserModel = require("../Models/UserModel");


const mongoose = require('mongoose');

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const createNote = async function (req, res) {
    try {
        let data = req.body
        const { title, content, author } = data
        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "enter data in user body" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "enter title in the body" })
        }
        const isTitle = await NoteModel.findOne({ title })
        if (isTitle) {
            return res.status(400).send({ msg: "Title should be unique" })
        }
        if (!isValid(content)) {
            return res.status(400).send({ status: false, msg: "enter content in  body" })
        }
        if (!isValid(author)) {
            return res.status(400).send({ status: false, msg: "enter valid author" })
        }
        const isauthor = await UserModel.findOne({ _id: author })
        if (!isauthor) {
            return res.status(400).send({ msg: "Invalid isauthor" })
        }
        const createDataNote = await NoteModel.create(data)
        return res.status(201).send({ msg: "sucessfully created", data: createDataNote })
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const getNotesQuery = async function (req, res) {
    try {
        let queryParams = req.query
        const { userId, title, content } = queryParams
        if (author || title || content) {
            if (isValidRequestBody(queryParams)) {

                if (queryParams.author && isValidObjectId(userId)) {
                    filterquery['userId'] = userId
                }

                if (isValid(title)) {
                    filterquery['title'] = title.trim()
                }

                if (isValid(content)) {
                    filterquery['content'] = content.trim()
                }
            }

        }

        const Notes = await NoteModel.find(filterquery).select({ _id: 1, title: 1, excerpt: 1, userId: 1, title: 1, releasedAt: 1, reviews: 1 })
        let sortedb = Notes.sort((a, b) => a.title.localeCompare(b.title));
        const count = Notes.length
        if (Notes.length < 0) {
            res.status(404).send({ status: false, msg: "No Notes found" })
            return
        }

        return res.status(200).send({ status: true, NumberofNotes: count, msg: "Notes list", data: sortedb })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}


const getNoteById = async function (req, res) {
    try {
        const id = req.params.NoteId
        const Notedata = await NoteModel.findOne({ _id: id })
        res.status(201).send({ status: true, msg: 'Note-list', data: Notedata })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


const updateNote = async function (req, res) {
    try {
        const { title, content, author } = data
        let Note = await NoteModel.findOne({ _id: id})
        if (!Note) {
            return res.status(400).send({ status: false, msg: "no Note found" })
        }

        let newNote = await NoteModel.findOneAndUpdate({ _id: id },
            { $set: { title: title, content: content, author: author } },
            { new: true })
       return res.status(201).send({ status: true, msg: 'data updated', data: newNote })

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const deleteNote = async function (req, res) {
    try {
        let id = req.params.NoteId
        let Notedetails = NoteModel.find({ _id: id})
        if (!Notedetails) {
            res.status(400).send({ status: false, msg: "Bad request" })
        }
        let newNotedata = await NoteModel.deleteOne({ id: id})
       return res.status(200).send({ sataus: true, msg: "successfully deleted", data: newNotedata })
    }

    catch (error) {

        res.status(500).send({ status: false, msg: error.message })

    }
}




module.exports.createNote = createNote
module.exports.getNotesQuery = getNotesQuery
module.exports.getNoteById = getNoteById
module.exports.updateNote = updateNote
module.exports.deleteNote = deleteNote