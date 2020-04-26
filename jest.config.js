module.exports = {
    preset: '@shelf/jest-mongodb',
    collectCoverage: true,
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", {
            "pageTitle": "Test Report",
            "theme": "darkTheme"
        }]
    ],
  };