const { sign, verify } = require('jsonwebtoken')

// constants
// process.env.JWT_SECRET -> akan diload di file app.js pake package "dotenv"
const JWT_SECRET = process.env.JWT_SECRET

// console.log({ JWT_SECRET })

function signToken({ id, email, role }) {
  return sign({ id, email, role }, JWT_SECRET)
}

// verifikasi, apakah tokennya dibuat oleh server kita
// caranya gimana? jwt akan bandingin JWT_SECRET sesuai engga
function verifyToken(token) {
  return verify(token, JWT_SECRET)
}

module.exports = {
  signToken, verifyToken
}
