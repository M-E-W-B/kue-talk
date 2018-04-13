const kue = require("kue");
const {
  host,
  port,
  auth,
  shutdownTimeout,
  watchdogInterval
} = require("./config");
const queue = kue.createQueue({
  redis: {
    host,
    port,
    auth
  }
});

// ========================================
// queue events
// ========================================
queue
  .on("error", function(err) {
    console.log("Error occured in the queue.", err);
  })
  .on("job enqueue", function(id, type) {
    console.log("job %s got queued of type %s", id, type);
  })
  .on("job complete", function(id, result) {
    kue.Job.get(id, function(err, job) {
      if (err) return;
      job.remove(function(err) {
        if (err) throw err;
        console.log("removed completed job #%d", job.id);
      });
    });
  });

// ========================================
// watch stuck jobs
// ========================================
queue.watchStuckJobs(watchdogInterval);

// ========================================
// queue shutdown
// ========================================
process.once("SIGTERM", function(sig) {
  console.log("[ Shutting down when all jobs finish... ]");
  queue.shutdown(shutdownTimeout, function(err) {
    console.log("[ All jobs finished. Kue is shut down. ]");
    process.exit(0);
  });
});

module.exports = queue;
