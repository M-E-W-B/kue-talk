const express = require("express");
const faker = require("faker");
const queue = require("./queue");
const processor = require("./processor");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.end("Welcome to Machine C!");
});

function createJob() {
  const priorities = ["low", "normal", "medium", "high", "critical"];
  const machines = ["A", "B", "C"];
  const machine = machines[(Math.random() * 3) | 0];
  const guy = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    city: faker.address.city()
  };

  const job = queue
    .create(`C-${machine}`, {
      title: `Machine C sent a guy named ${guy.name} to Machine ${machine}`,
      guy
    })
    .on("complete", function(data) {
      console.log(`Guy named ${data.name} reached at Machine ${data.extra}!`);
    })
    .on("failed attempt", function(errorMessage, doneAttempts) {
      console.log(
        `Guy named ${
          guy.name
        } is trying to reach at Machine ${machine} by hitchhiking!`
      );
    })
    .on("failed", function(errorMessage) {
      console.log(
        `Guy named ${guy.name} couldn't reach at Machine ${machine}!`
      );
    })
    .delay((Math.random() * 2) | 0)
    .priority(priorities[(Math.random() * 5) | 0])
    .attempts(2) // retry 2 times if fails
    .backoff({ delay: 5 * 1000, type: "fixed" }) // don't retry immediately but after 5 seconds
    .save(err => {
      if (!err) {
        console.log(
          `JOB ${job.id} :- Guy named ${
            data.name
          } started from Machine C to Machine ${machine}!`
        );
        setTimeout(createJob, (Math.random() * 5) | 0);
      }
    });
}

createJob();

module.exports = app;
