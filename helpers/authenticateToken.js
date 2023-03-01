const jwt = require('jsonwebtoken')

//authenticateToken function
function authenticateUserToken(req, res, next) {
    // console.log(req.headers);
    console.log("called");
    const authHeader = req.headers['authorization']
    // console.log("before",authHeader);
    const accessToken = authHeader && authHeader.split(' ')[1]
    // console.log("after",authHeader);
    if (accessToken == null) {
        res.json({ message: 'Invalid token.', success: false });
        return;
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.json({ message: 'Invalid token.', success: false });

        req.user = user;
        next();
    })
}

module.exports = authenticateUserToken;