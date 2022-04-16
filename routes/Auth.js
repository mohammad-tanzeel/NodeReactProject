const AuthController = require('../controller/AuthController');
const verifyToken = require("../middleware/verifyToken");

module.exports = function(app){
    app.post('/register', AuthController.register);
    app.post('/login', AuthController.login);
    app.get('/test-token', verifyToken, AuthController.testtoken);
};

