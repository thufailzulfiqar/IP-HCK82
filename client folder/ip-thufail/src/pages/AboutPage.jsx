import React from "react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-[url('/background.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
      <div className="w-full max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          About This Website
        </h1>
        <p className="text-white text-lg">
          <strong>AmazingDragonBall </strong> is a passion project and fan-made
          web application dedicated to the legendary Dragon Ball universe.
          Inspired by the thrilling fusions, intense battles, and unforgettable
          characters created by Akira Toriyama, this app was built for one
          reason only — to have fun while celebrating a series that shaped
          generations of anime fans.
        </p>

        <p className="text-white text-lg mt-4">
          The main idea behind AmazingDragonBall is simple: what happens when
          you fuse two iconic Dragon Ball characters into one? What would a
          fusion between Vegeta and Frieza look like? Or how about combining
          Goku and Cell? This app lets your imagination run wild as you
          experiment with unexpected character combinations and visualize
          brand-new warriors.
        </p>

        <p className="text-white text-lg mt-4">
          Beyond just entertainment, this project serves as a playground for
          learning and experimentation. It was developed as a way to dive deeper
          into the world of software engineering, UI/UX design, and creative
          coding. Every part of this app — from the interface design to the
          fusion logic — was crafted with curiosity, late nights, and plenty of
          trial and error (just like Goku learning a new transformation).
        </p>

        <p className="text-white text-lg mt-4">
          It’s important to note that AmazingDragonBall is a fan-made,
          non-commercial project. It is not affiliated with, endorsed by, or
          associated with Toei Animation, Shueisha, Bandai, or any official
          Dragon Ball entities. All characters and original content belong to
          their respective copyright holders.
        </p>

        <p className="text-white text-lg mt-4">
          If you're a lifelong Dragon Ball fan or someone just looking to see
          some crazy fusion combinations, you're welcome here. Thanks for
          stopping by, and may your power level never stop rising!
        </p>
      </div>
    </div>
  );
}
