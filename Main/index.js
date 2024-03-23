const connectToMongo = require("./connections");
const express = require("express");
var cors = require("cors");
const axios = require("axios");
const User = require("../Models/User");
const Chat = require("../Models/Chat");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyC93XxpL8z7dz4UjNBvECFYaobAOQre0Bk");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

connectToMongo();
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const jwt_secret = "88465123";

app.post(
  "/signup",
  [body("email", "Enter a valid email").isEmail()],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "This email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const safepass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: safepass,
        number: req.body.number,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);
      success = true;
      res.status(200).json({ success, authtoken, data });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occurred");
    }
  }
);
app.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log(email);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Please enter correct email" });
      }

      const passwordcheck = await bcrypt.compare(password, user.password);
      if (!passwordcheck) {
        return res
          .status(401)
          .send({ success, error: "Please enter correct password" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);
      success = true;
      res.status(200).json({ success, authtoken, data });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occurred");
    }
  }
);

app.post("/add-chat", (req, res) => {
  const body = req.body;
  Chat.findOne({ userId: body.userId, chatId: body.chatId }).then(
    async (result, err) => {
      if (result) {
        Chat.findOneAndUpdate(
          { chatId: body.chatId },
          { chats: body.chats }
        ).then((final, err) => {
          if (err) {
            res.send(err);
          } else {
            res.send({ message: "Chat updated successfully", data: final });
          }
        });
      } else {
        Chat.insertMany({
          userId: body.userId,
          chatId: body.chatId,
          chats: body.chats,
        })
          .then(() => {
            res.send({ message: "Added!" });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  );
});

app.get("/get-chats", (req, res) => {
  const query = req.query;
  Chat.find({ userId: query.userId }).then((result, err) => {
    if (result) {
      const uniqueArray = result.filter(
        (obj, index, self) =>
          index === self.findIndex((o) => o.chatId === obj.chatId)
      );
      res.send(uniqueArray);
    } else {
      res.send(err);
    }
  });
});

app.get("/get-single-chat", (req, res) => {
  const query = req.query;
  Chat.find({ chatId: query.chatId }).then((result, err) => {
    if (result) {
      res.send(result);
    } else {
      res.send(err);
    }
  });
});

app.post("/generate", async (req, res) => {
  const query = req.body;
  const previousHistory = req.body.history;
  let history = [];

  previousHistory?.map((item) => {
    history.push(
      { role: "user", parts: [{ text: item?.question }] },
      { role: "model", parts: [{ text: item?.answer }] }
    );
  });

  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(query.prompt);

  const response = await result.response;
  const text = response.text();

  console.log(text);
  res.send({ gen_response: text });
});

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
