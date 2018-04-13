const kue = require("kue");
const { host, port, auth } = require("./config");
const queue = kue.createQueue({
  redis: {
    host,
    port,
    auth
  }
});

const concurrency = 2; // default

queue.process("A-A", concurrency, function(job, done) {
  setTimeout(function() {
    const { data } = job;
    data.extra = "A";

    if (!((Math.random() * 3) | 0))
      done(new Error("Oops! This doesn't look good."));
    else done(null, data);
  }, 2000);
});

queue.process("A-B", concurrency, function(job, done) {
  setTimeout(function() {
    const { data } = job;
    data.extra = "B";

    if (!((Math.random() * 3) | 0))
      done(new Error("Oops! This doesn't look good."));
    else done(null, data);
  }, 2000);
});

queue.process("A-C", concurrency, function(job, done) {
  setTimeout(function() {
    const { data } = job;
    data.extra = "C";

    if (!((Math.random() * 3) | 0))
      done(new Error("Oops! This doesn't look good."));
    else done(null, data);
  }, 2000);
});
