<template>
  <div class="about">
    <h1>Welcome to Music Organizer</h1>
    <p>
      Are you a music lover who enjoys all sorts of music but struggles to keep your collection
      organized? Look no further! Our platform is designed to help you manage and enjoy your music
      collection effortlessly.
    </p>

    <div class="features">
      <h2>Features</h2>
      <ul>
        <li>Organize your songs using tags and categories</li>
        <li>Create snippets of songs for quick previews</li>
        <li>Discover similar songs you'll love</li>
        <li>Explore your listening history</li>
        <li>And much more...</li>
      </ul>
    </div>

    <p>
      Whether you're a casual listener or a music enthusiast, our platform helps you better organize
      and enjoy your music collection. Start exploring and bring order to your musical world!
    </p>
  </div>
</template>

<style>
.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #121212; /* Dark background color */
  color: #ffffff; /* White text color */
}

.features {
  margin: 2rem 0;
}

ul {
  list-style-type: none;
  padding-left: 0;
  width: 50%;
}

li {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #1e1e1e; /* Slightly lighter dark color */
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* Darker shadow */
  color: #ffffff; /* White text color */
}

@media (min-width: 1024px) {
  .about {
    padding: 4rem;
  }

  ul {
    width: 40%;
  }
}
</style>
