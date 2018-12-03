const {Admin, validate, generateToken} = require('../models/admin');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await Admin.findOne();
    if (admin) return res.status(400).send('Admin account already exists');

    admin = new Admin(_.pick(req.body, ['username', 'password']));

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    
    await admin.save();

    res.send(admin);
});


router.post('/auth', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await Admin.findOne({username: req.body.username});
    if (!admin) return res.status(400).send('Invalid username or password');

    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if(!validPassword) return res.status(400).send('Invalid username or password');

    const token = generateToken();
    res.send(token);
});

module.exports = router;