// const { verifyToken} = require("../helpers/jwt")
// const { User } = require('../models')

// async function authentication(req, res, next) {
//     try {
//         const { authorization } = req.headers

//         if (!authorization) {
//             throw { name: "Unauthorized", message: "Invalid Token"}
//         }

//         const rawToken = authorization.split(" ")
//         const tokenType = rawToken[0]
//         const tokenValue = rawToken[1]

//         if (tokenType !== "Bearer" || !tokenValue) {
//             throw { name: "Unauthorized", message: "Invalid Token"}
//         }

//         const hasil = verifyToken(tokenValue)
//         const user = await User.findByPk(hasil.id)
//         console.log(user);
//         if (!user) {
//             throw { name: "Unauthorized", message: "Invalid Token"}
//         }

//         req.user = {
//             id: user.id,
//             role: user.role
//         }
        
        

//         next()
//     } catch (error) {
//         next(error)
//     }
// }

// module.exports = authentication