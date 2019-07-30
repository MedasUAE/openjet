const openjet = require('../businessLogic/openJetAPI').medicineAPICall;
const logger = require('../lib/logger');


module.exports = function (server, restify) {
    //medicine request api
    server.post('/medicinerequest', restify.plugins.conditionalHandler([
        { version: '1.0.0', handler: medRequstHandler }
    ]));
} 

async function medRequstHandler(req,res,next) {
    try {
        //calling openjet API
        const response = await openjet(req.body);
        res.send(200, { data: response });
        
         //go to after handler
         return next();
    } catch (error) {
        logger.error("route.js, Handlers: medRequstHandler " + error, error.stack);
        //error when parsing data
        res.send(200, {data: {
            message: error.message,
            code: "",
            statusCode: 400,
            data: error.stack
        }}); //ToDo Error Code
        return next();
    }
}