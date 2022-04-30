const express = require("express")
const aerect = require('aerect.js')
const router = express.Router();
const notebins = require('../database/notebin')
const { body, validationResult } = require('express-validator');

router.post('/create', [
    body('text', 'Please  provide a text that is atleast 1 character long').isLength({ min: 1 })], async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()})
        }
        const ID = aerect.generateID(10)
        const note = req.body.text  
        notebins.findOne({ID: ID}, async (err, data) => {
            if(data) {
                res.status(500).json({error: "An unexpected error has occured please try again."})
            } else {
                await new notebins({ID: ID, views: 0, note: note, created: Date.now()}).save()
                return res.status(200).json({url: `https://www.notebin.cf/${ID}`})
            }
        })

    })
  
    module.exports = router;