const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
    const token = req.header('Authorization');
    if(!token) res.status(401).send('Access denied. No Token Provided.');

    try{
        const decoded = jwt.verify(token, config.get('jsonTokenPrivKey'));
        req.user = decoded;
        next();
    }catch(ex){
        res.status(400).send('Invalid Token.');
    }
}

module.exports = auth;