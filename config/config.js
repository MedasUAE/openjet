module.exports = {
    "loglevel": "3", //0: ERROR, 1: WARN, 2: INFO, 3: DEBUG
    "showconsole": true,
    "port": process.env.PORT || 3000,
    "auth": {
        "user": process.env.OPENJET_USER,
        "pass": process.env.OPENJET_PASSWORD
      }
}