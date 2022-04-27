//require('dotenv').config() //comment this when running on production
require('./mongoDB')()
const notes = require('./database/notebin')
const express = require("express")
const app = express()
const logger = require('morgan');
const aerect = require('aerect.js')
app.set('view-engine', 'ejs')
app.use(logger('dev'));
const error = require('./middleware/error');
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(error)


app.get('/:ID', (req, res) => {
    const ID = req.params.ID
    notes.findOne({ID: ID}, async (err, data) => {
        if(data) {
            data.views++
            await data.save()
            return res.render('bin.ejs', {code: data.note, views: data.views})
        } else {
            return res.status('404').send('Error 404: Page not found.')
        }
    })

    
})
app.get('/', (req, res) => {
    res.render('home.ejs')
})
app.post('/', (req, res) => {
const ID = aerect.generateID(10)
 const note = req.body.text   
 if(note.length > 5000) {
     return res.sendStatus(413)
 }
 notes.findOne({ID: ID}, async (err, data) => {
     if(data) {
         return res.sendStatus(409)
     } else {
         new notes({ID: ID, views: 0, note: note, created: Date.now()}).save()
         return res.redirect(`/${ID}`)
     }
 })
})
const PORT = process.env.PORT || 8080
app.listen(PORT, () => { 
    console.log(`App Started on ${PORT}`) 
  });