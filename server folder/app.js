if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const axios = require("axios");
// const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/characters", async (req, res) => {
  try {
    const { page, limit } = req.query;
    const response = await axios.get(
      "https://dragonball-api.com/api/characters", {
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
    const { page, limit } = req.query
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
    const response = await axios.get("https://dragonball-api.com/api/transformations");
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

module.exports = app;
