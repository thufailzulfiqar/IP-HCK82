if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const axios = require("axios");
const { User } = require("./models");
const { signToken } = require("./helpers/jwt");
const errorHandler = require("./middlewares/errorHandler");
const { comparePassword, hashPassword } = require("./helpers/bcrypt");
const { isAdmin } = require("./middlewares/authorization");
const authentication = require("./middlewares/authentication");
const cors = require("cors");
app.use(cors());
const { OAuth2Client } = require("google-auth-library");
const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const client = new OAuth2Client();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

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

app.post("/login-google", async (req, res, next) => {
  try {
    const { googleToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      await User.create({
        email: payload.email,
        password: hashPassword(Math.random().toString(36).slice(2, 10)), // generate random password
        username: payload.name,
      });
    }

    const access_token = signToken({
      id: user.id,
    });

    res.status(200).json({
      access_token: access_token,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/register", async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email) {
      throw { name: "BadRequest", message: "Email is required" };
    }
    if (!password) {
      throw { name: "BadRequest", message: "Password is required" };
    }
    if (!username) {
      throw { name: "BadRequest", message: "Username is required" };
    }
    const user = await User.create({
      email: email,
      password: password,
      username,
      username,
    });
    const hasil = user.toJSON();
    delete hasil.password;

    res.status(201).json(hasil);
  } catch (err) {
    next(err);
  }
});

app.get("/users/profile", authentication, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }, // Jangan kirim password ke frontend
    });

    if (!user) {
      throw { name: "NotFound", message: "User not found" };
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

app.delete("/users/:id", authentication, async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      throw { name: "NotFound", message: "User not found" };
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

app.patch("/users/edit", authentication, async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    if (!email && !username && !password) {
      throw { name: "BadRequest", message: "At least one field is required" };
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw { name: "NotFound", message: "User not found" };
    }

    if (email) user.email = email;
    if (username) user.username = username;
    if (password) user.password = hashPassword(password); // rehash password

    await user.save();

    const result = user.toJSON();
    delete result.password;

    res.status(200).json({
      message: "User updated successfully",
      user: result,
    });
  } catch (err) {
    next(err);
  }
});

// 3rd party API database endpoints
app.post("/fusion", async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    const { character1, character2 } = req.body;

    if (!character1 || !character2) {
      return res.status(400).json({ error: "2 characters are required" });
    }

    // Buat prompt berdasarkan data karakter
    const prompt = `
      Create a high-quality 2D rendered anime-style image of 1 character of a fusion between these two characters:
      1. ${character1.name} - ${character1.race}, ${character1.gender}, Affiliation: ${character1.affiliation}, KI: ${character1.ki}, Max KI: ${character1.maxKi}, Image: ${character1.image}
      2. ${character2.name} - ${character2.race}, ${character2.gender}, Affiliation: ${character2.affiliation}, KI: ${character2.ki}, Max KI: ${character2.maxKi}, Image: ${character2.image}
      
      The resulting fusion should physically and stylistically incorporate key traits from both characters, such as their hairstyle, outfit elements, facial expressions, aura, and fighting stance. The fusion should also reflect their personalities—whether calm, aggressive, playful, or strategic. Make sure the fusion looks powerful and balanced, as if it could exist in the Dragon Ball universe. Use a dramatic anime art style with vibrant colors and energy effects.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let imageBase64 = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: "No image generated" });
    }

    res.json({ image: imageBase64 }); // Kirim base64 image ke frontend
  } catch (error) {
    console.error("Fusion generation failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/characters", authentication, async (req, res) => {
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

app.get("/characters/:id", authentication, async (req, res) => {
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
    res.status(500).json({ error: `Failed to fetch character` });
  }
});

app.get("/planets", authentication, async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch planets" });
  }
});

app.get("/planets/:id", authentication, async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch planets" });
  }
});

app.get("/transformations", authentication, async (req, res) => {
  try {
    const response = await axios.get(
      "https://dragonball-api.com/api/transformations"
    );
    const characters = response.data;

    res.json(characters);
  } catch (error) {
    console.error("Error fetching Dragon Ball characters:", error.message);
    res.status(500).json({ error: "Failed to fetch transformations" });
  }
});

app.get("/transformations/:id", authentication, async (req, res) => {
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
    res.status(500).json({ error: "Failed to fetch transformations" });
  }
});

// middleware error handler
app.use(errorHandler);

module.exports = app;
