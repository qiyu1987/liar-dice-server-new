const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const bcrypt = require("bcrypt");
const User = require("../user/model");

const router = new Router();

// define endpoints here
router.post("/login", (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please give me some credentials" });
  }

  // Query to find a user by name (unique, right ;) )
  User.findOne({
    where: {
      name: req.body.name
    }
  })
    .then(user => {
      // we can get null, it was not found
      if (!user) {
        res.status(400).send({
          message: "User with that name does not exist, Please signup first."
        });
      }

      // 2. use bcrypt.compareSync to check the password against the stored hash
      else if (bcrypt.compareSync(req.body.password, user.password)) {
        // 3. if the password is correct, return a JWT with the userId of the user (user.id)
        res.send({
          jwt: toJWT({ userId: user.id }) // make a token, with userId encrypted inside of it
        });
      } else {
        res.status(400).send({
          message: "Name or password incorrect, sorry"
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong"
      });
    });
});

module.exports = router;
