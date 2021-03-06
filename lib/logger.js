const fs = require('fs');
let log = {};

const level = require('../config/config').loglevel;
if(level == undefined) level = 3;

const showconsle = require('../config/config').showconsole;
if(!showconsle) showconsle = true;

log.debug = function(message){
    if(level<3) return;
    consoleLog(message, "\x1b[34mDebug\x1b[0m"); 
}

log.info = function(message){
    if(level<2) return;
    consoleLog(message, "\x1b[36mInfo\x1b[0m");
}

log.warn = function(message){
    if(level<1) return;
    consoleLog(message, "\x1b[34mDebug\x1b[0m"); 
}

log.error = function(message, stack){
    if(level<0) return;
    consoleLog(message, "\x1b[31mError\x1b[0m", stack);
}

log.apiRequestLog = function(req){
    if(level < 0) return;
    consoleLog(getRequestString(req), "\x1b[35mApi\x1b[0m");
}

log.apiResponseLog = function(param){
    if(level < 0) return;
    consoleLog(getResponseString(param), "\x1b[35mApi\x1b[0m");
}

/*
    make request console log string
*/
function getRequestString(req){
    return  "\x1b[34m" + "REQUEST:" + "\x1b[0m" +
            req.method  + " " +
            req.url + " " +
            req.getId()
}

/*
    make response console log string
*/
function getResponseString(param){
    if (typeof param.req === "object" && typeof param.res === "object" && typeof param.res === "object") 
        return  "\x1b[33m" + "RESPONSE" + "\x1b[0m" +
                "(\x1b[32m" + param.res.statusCode + "\x1b[0m): " + 
                param.req.method + " " +
                param.req.url + " " +
                param.req.getId();
    else
        console.log("Something wrong in getResponseString.");
}

function consoleLog(message, type, stack){
    if (showconsle) {
        // console.log(
        //     type, 
        //     Date.now(), ":",
        //     message)
        
        console.log(
            `${new Date().toISOString()} ${type}: ${message}  ${(stack) ? "\n" + stack : ""}`
        );
    }else return;
}
module.exports = log;