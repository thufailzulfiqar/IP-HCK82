if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const axios = require("axios");
const { User } = require("./models");
const { signToken } = require("./helpers/jwt");
const errorHandler = require("./middlewares/errorHandler");
const { comparePassword } = require("./helpers/bcrypt");
const { isAdmin } = require("./middlewares/authorization");
const authentication = require("./middlewares/authentication");
// const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Users endpoints
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw { name: "BadRequest", message: "Email is required" };
    }
    if (!password) {
      throw { name: "BadRequest", message: "Password is required" };
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw { name: "Unauthorized", message: "email/password is invalid" };
    }

    const isValid = comparePassword(password, user.password);
    if (!isValid) {
      throw { name: "Unauthorized", message: "email/password is invalid" };
    }

    const access_token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      access_token: access_token,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/addStaff", authentication, isAdmin, async (req, res, next) => {
  try {
    const {email, password, username} = req.body
    const user = await User.create({
        email: email,
        password: password,
        username, username
    })
    const hasil = user.toJSON()
    delete hasil.password

    res.status(201).json(hasil)
} catch (err) {
    next(err)
}
})


// 3rd party API database endpoints
app.get("/characters", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const response = await axios.get(
      "https://dragonball-api.com/api/characters",
      {
        params: {
          page,
          limit,
        },
      }
    );
    const characters = response.data;

    res.json(characters);
  } catch (error) {
    console.error("Error fetching Dragon Ball characters:", error.message);
    res.status(500).json({ error: "Failed to fetch characters" });
  }
});

app.get("/characters/:id", async (req, res) => {
  const { id } = req.params; // ambil id dari URL
  try {
    const response = await axios.get(
      `https://dragonball-api.com/api/characters/${id}`
    );
    const character = response.data;

    res.json(character);
  } catch (error) {
    console.error(
      `Error fetching Dragon Ball character with id ${id}:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch character" });
  }
});

app.get("/planets", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const response = await axios.get("https://dragonball-api.com/api/planets", {
      params: {
        page,
        limit,
      },
    });
    const characters = response.data;

    res.json(characters);
  } catch (error) {
    console.error("Error fetching Dragon Ball characters:", error.message);
    res.status(500).json({ error: "Failed to fetch characters" });
  }
});

app.get("/planets/:id", async (req, res) => {
  const { id } = req.params; // ambil id dari URL
  try {
    const response = await axios.get(
      `https://dragonball-api.com/api/planets/${id}`
    );
    const character = response.data;

    res.json(character);
  } catch (error) {
    console.error(
      `Error fetching Dragon Ball character with id ${id}:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch character" });
  }
});

app.get("/transformations", async (req, res) => {
  try {
    const response = await axios.get(
      "https://dragonball-api.com/api/transformations"
    );
    const characters = response.data;

    res.json(characters);
  } catch (error) {
    console.error("Error fetching Dragon Ball characters:", error.message);
    res.status(500).json({ error: "Failed to fetch characters" });
  }
});

app.get("/transformations/:id", async (req, res) => {
  const { id } = req.params; // ambil id dari URL
  try {
    const response = await axios.get(
      `https://dragonball-api.com/api/transformations/${id}`
    );
    const character = response.data;

    res.json(character);
  } catch (error) {
    console.error(
      `Error fetching Dragon Ball character with id ${id}:`,
      error.message
    );
    res.status(500).json({ error: "Failed to fetch character" });
  }
});

// middleware error handler
app.use(errorHandler);

module.exports = app;
