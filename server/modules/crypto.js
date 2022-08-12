//module include
const crypto = require('crypto');
var jwt = require('jwt-simple');
require('dotenv').config();

//class
class dataCrypto {
    //sha256 hex
    sha256(text) {
        return crypto.createHash('sha256').update(text).digest('hex');
    }
    //base64
    base64(text, todo = "encode") {
        if (todo == "encode") {
            return Buffer.from(text, "utf8").toString('base64').replace('==', '');
        } else if (todo == "decode") {
            return Buffer.from(text + "==", "base64").toString('utf8');
        } else {
            return 0;
        }
    }
    //jwt
    jwt(text, todo = "encode") {
        var cryptoKey = process.env.cryptoKey;
        if (todo == "encode") {
            return jwt.encode(text, cryptoKey);
        } else if (todo == "decode") {
            return jwt.decode(text, cryptoKey);
        } else {
            return 0;
        }
    }
}

module.exports = dataCrypto;