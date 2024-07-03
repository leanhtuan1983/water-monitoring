const user_router = require('./user');
const admin_router = require('./admin');

function route(app){
    app.use('/admin', admin_router);
    app.use('/', user_router);   
}

module.exports = route;
