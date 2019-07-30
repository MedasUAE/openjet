const fs = require('fs');
let log = {};

const level = require('../config/config').loglevel;
if(!level) level = "all";

const showconsle = require('../config/config').showconsole;
if(!showconsle) showconsle = true;

log.info = function(message){
    if(level.toLowerCase() != "info" && level.toLowerCase() != "all") return;
        consoleLog(message, "\x1b[36mInfo\x1b[0m");
}

log.debug = function(message){
    if(level.toLowerCase() != "debug" && level.toLowerCase() != "all") return;
        consoleLog(message, "\x1b[34mDebug\x1b[0m"); 
}

log.error = function(message, stack){
    if(level.toLowerCase() != "error" && level.toLowerCase() != "all") return;
        consoleLog(message, "\x1b[31mError\x1b[0m", stack);
}

log.apiRequestLog = function(req){
    if(level.toLowerCase() == "off") return;
    consoleLog(getRequestString(req), "\x1b[35mApi\x1b[0m");
}

log.apiResponseLog = function(param){
    if(level.toLowerCase() == "off") return;
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
            `${Date.now()} ${type}: ${message}  ${(stack) ? "\n" + stack : ""}`
        );
    }else return;
}
module.exports = log;