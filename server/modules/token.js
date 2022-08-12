const dbConn = require('./database');
const crypto = require('./crypto');

const dataCrypto = new crypto();

class token {
    generate(username, email, isNew = true, token = null) {
        if (isNew === true) {
            var nowTimestamp = Math.floor(new Date().getTime() / 1000);
            var edTimestamp = nowTimestamp + 31536000;
            var jwtData = dataCrypto.jwt({ username: username, email: email, pfp: "/asset/default_pfp.png" });
            return jwtData + ":" + dataCrypto.base64(nowTimestamp.toString()) + ":" + dataCrypto.base64(edTimestamp.toString());
        } else if (isNew === false) {
            var tokenInfo = token.split(":");
            var jwtData = dataCrypto.jwt(tokenInfo[0], "decode");
            var newJwt = dataCrypto.jwt({ username: username, email: email, pfp: jwtData["pfp"] });
            return newJwt + ":" + tokenInfo[1] + ":" + tokenInfo[2];
        } else if (isNew === "temp") {
            var nowTimestamp = Math.floor(new Date().getTime() / 1000);
            var edTimestamp = nowTimestamp + 900;
            var jwtData = dataCrypto.jwt({ email: email, token_info: "temp token" });
            return jwtData + ":" + dataCrypto.base64(nowTimestamp.toString()) + ":" + dataCrypto.base64(edTimestamp.toString());
        }
    }
    updateED(token) {
        var tokenInfo = token.split(":");
        var jwtData = dataCrypto.jwt(tokenInfo[0], "decode")
        dbConn.query(`SELECT * FROM user WHERE token="${token}"`, function (err, rows, filelds) {
            if (!err) {
                try {
                    if (jwtData["username"] === rows[0].username && jwtData["email"] === rows[0].email) {
                        var nowTimestamp = Math.floor(new Date().getTime() / 1000);
                        var edTimestamp = nowTimestamp + 31536000;
                        var jwtData = dataCrypto.jwt(jwtData);
                        return jwtData + ":" + tokenInfo[1] + ":" + dataCrypto.base64(edTimestamp.toString());
                    } else {
                        return 0;
                    }
                } catch {
                    return 0;
                }
            } else {
                return 0;
            }
        });
    }
    isExpiration(token) {
        var tokenInfo = token.split(":");
        if (dataCrypto.base64(tokenInfo[1], "decode") > Math.floor(new Date().getTime() / 1000) || dataCrypto.base64(tokenInfo[2], "decode") < Math.floor(new Date().getTime() / 1000)) {
            return 1;
        } else { return 0; }
    }
}

module.exports = token;