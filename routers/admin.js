const {Admin, validate, generateToken} = require('../models/admin');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

// Register Admin
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
    res.send({authToken: token});
});

router.put('/changePass', [auth, admin] , async (req, res) => {
    // Get Admin
    let admin = await Admin.findOne();

    const validPassword = await bcrypt.compare(req.body.currentPass, admin.password);
    if(!validPassword) return res.status(400).send('Invalid current password');

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(req.body.newPass, salt);

    admin.save();

    res.send("Password has changed!");
});

module.exports = router;