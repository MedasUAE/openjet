module.exports = {
    "loglevel": "all",
    "showconsole": true,
    "port": 3000,
    "auth": {
        "user": process.env.OPENJET_USER,
        "pass": process.env.OPENJET_PASSWORD
      }
}