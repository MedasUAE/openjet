module.exports = {
    "loglevel": "all",
    "showconsole": true,
    "port": process.env.PORT || 3000,
    "auth": {
        "user": process.env.OPENJET_USER,
        "pass": process.env.OPENJET_PASSWORD
      }
}