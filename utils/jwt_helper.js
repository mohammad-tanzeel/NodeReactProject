module.exports = {
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
          const payload = {}
          const secret = process.env.REFRESH_TOKEN_SECRET
          const options = {
            expiresIn: '1y',
            issuer: 'pickurpage.com',
            audience: userId,
          }
          JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
              console.log(err.message)
              // reject(err)
              reject(createError.InternalServerError())
            }
    
            // client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
            //   if (err) {
            //     console.log(err.message)
            //     reject(createError.InternalServerError())
            //     return
            //   }
            //   resolve(token)
            // })
          })
        })
      }
    
}