const { writeToPath } = require("@fast-csv/format");

const path = "people.csv";
const data = [
  { name: "Stevie", id: 10 },
  { name: "Ray", id: 20 },
];
const options = { headers: true, quoteColumns: true };

writeToPath(path, data, options)
  .on("error", (err) => console.error(err))
  .on("finish", () => console.log("Done writing."));
