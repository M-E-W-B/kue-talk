const kue = require("kue");
const app = require("./app");

console.log(`
========================================
Welcome to Machine A!
========================================
`);

app.listen(9000);
kue.app.listen(3000);
