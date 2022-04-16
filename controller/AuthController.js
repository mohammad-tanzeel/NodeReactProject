"user strict";
const connection = require("../config/mysql-db");
const bcrypt = require("bcryptjs");
// const createError = require('http-errors')
var User = require("../model/User.Model.js");

const jwt = require("jsonwebtoken");
// const client = require('../utils/init_redis')

exports.register = async (req, res, next) => {
  try {
    connection.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER(${connection.escape(
        req.body.email
      )});`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: "This user is already in use!",
          });
        } else {
          // username is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err,
              });
            } else {
              // has hashed pw => add to database
              connection.query(
                `INSERT INTO users (name, email, password) VALUES ('${
                  req.body.name
                }', ${connection.escape(req.body.email)}, ${connection.escape(hash)})`,
                (err, result) => {
                  if (err) {
                    throw err;
                    return res.status(400).send({
                      msg: err,
                    });
                  }
                  return res.status(201).send({
                    msg: "The user has been registerd with us!",
                  });
                }
              );
            }
          });
        }
      }
    );
  
    // const oldUser = await User.findOne({ email });

    // if (oldUser) {
    //   return res.status(409).send("User Already Exist. Please Login");
    // }

    // encryptedPassword = await bcrypt.hash(password, 10);

    // // Create user in our database
    // const user = await User.create({
    //   email: email.toLowerCase(), // sanitize: convert email to lowercase
    //   password: encryptedPassword,
    // });

    // const token = jwt.sign(
    //   { user_id: user._id, email },
    //   process.env.TOKEN_KEY,
    //   {
    //     expiresIn: "2h",
    //   }
    // );
    // // save user token
    // user.token = token;
    // const refreshToken = await signRefreshToken(savedUser.id)

    // client.SET(user._id, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
    //   if (err) {
    //     console.log(err.message)
    //     reject(createError.InternalServerError())
    //     return
    //   }
    //   resolve(token)
    // })

    // return new user
    // res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};


// routes/router.js

exports.login = async function (req, res) {
  try {
  connection.query(
    `SELECT * FROM users WHERE email = ${connection.escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err
        });
      }

      if (!result.length) {
        return res.status(401).send({
          msg: 'Username or password is incorrect!'
        });
      }

      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'password is incorrect!'
            });
          }

          if (bResult) {
            const accessToken = jwt.sign({username: result[0].email,userId: result[0].id },'access', {
                expiresIn: '1d'
              }
            );
            
            const refreshToken = jwt.sign({username: result[0].email,userId: result[0].id },'refresh', {
              expiresIn: '7d'
            }
          );
          connection.query(
            `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
          );
          return res.status(200).send({
            msg: 'Logged in!',
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: result[0]
          });
          }
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
      );
    }
  );
} catch (err) {
  return res.status(401).send({
    msg: err
  });
  // console.log(err);
}
};

exports.testtoken = async function(req, res){
  res.status(200).send("Token have verified ");
}

// exports.login = async function (req, res) {
//   // const user = req.body.user;
//   try {
//     const { email, password } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }
//     // Validate if user exist in our database
//     const user = await User.findOne({ email });
//     // res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
//     // res.setHeader('Access-Control-Allow-Credentials', true);
//     // res.setHeader('Content-Type', 'application/json');
//     // res
//     //     .status(200)
//     //     .send({ message: "Login user." });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Create token
//       let accessToken = jwt.sign({ user_id: user._id, email }, "access", {
//         expiresIn: "20s",
//       });
//       let refreshToken = jwt.sign({ user_id: user._id, email }, "refresh", {
//         expiresIn: "7d",
//       });
//       user.accessToken = accessToken;
//       user.refreshToken = refreshToken;
//       // console.log(accessToken);
//       // console.log(user);
//       // user
//       res.status(200).send(user);
//     }

//     res.status(400).send("Invalid Credentials");
//   } catch (err) {
//     res.status(409).send(err);
//     console.log(err);
//   }
// };
