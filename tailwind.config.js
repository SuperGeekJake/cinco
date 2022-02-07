module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      light: "#FFF7EE",
      dark: "#15202B",
      blue: "#0091AD",
      green: "#8FD5A6",
      red: "#D282A6",
      yellow: "#FFB35C",
    },
    extend: {
      gridTemplateColumns: {
        19: "repeat(19, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
