exports.cookieParsers = (req, res, next) => {
    if (!req.cookie) {
        const valueName = req.headers.cookie ? req.headers.cookie.split("=")[1] 
        : (req.ip).slice(0, 2) + '***' + new Date().getTime().toString().slice(0, new Date().getTime().toString().length - 6);
        console.log(req.ip)
        if(req.headers.cookie) {
            const first = valueName.slice(0, 35)
            const last = valueName.slice(35, valueName.length)
            req.cookie = last.slice(0, 10) + first.slice(3, 10)
        } else {
            req.cookie = valueName
        }
    }
    next();
  }

