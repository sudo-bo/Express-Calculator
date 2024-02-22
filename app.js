const express = require("express");
const app = express();
const port = 3000;

app.get("/mean", (req, res, next) => {
  try {
    const numbers = req.query.numbers.split(",").map(Number);
    const mean = numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length;
    return res.json({ response: { operation: "mean", value: mean } });
  } catch (e) {
    next(e);
  }
});

app.get("/median", (req, res, next) => {
  try {
    let numbers = req.query.numbers
      .split(",")
      .map(Number)
      .sort((a, b) => a - b);
    let midIndex = Math.floor(numbers.length / 2);
    let median;
    if (numbers.length % 2 === 0) {
      median = (numbers[midIndex] + numbers[midIndex - 1]) / 1;
    } else {
      median = numbers[midIndex];
    }
    return res.json({ response: { operation: "median", value: median } });
  } catch (e) {
    next(e);
  }
});

app.get("/mode", (req, res, next) => {
  try {
    const numbers = req.query.numbers.split(",").map(Number);
    let modeMap = {};
    let maxCount = 1;
    let modes = [];

    numbers.forEach((num) => {
      if (modeMap[num]) {
        modeMap[num]++;
      } else {
        modeMap[num] = 1;
      }

      if (modeMap[num] > maxCount) {
        modes = [num];
        maxCount = modeMap[num];
      } else if (modeMap[num] === maxCount) {
        // the array could have multiple nodes
        modes.push(num);
        maxCount = modeMap[num];
      }
    });

    modes = [...new Set(modes)]; // Ensure modes are unique

    return res.json({ response: { operation: "mode", value: modes } });
  } catch (e) {
    next(e);
  }
});

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  return res.status(error.status || 500).send(error.message);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
