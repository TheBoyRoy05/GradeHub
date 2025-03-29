const fs = require("fs");
const schools = require("./schools.json");

const cleanedSchools = [];

for (let i = 0; i < schools.length; i++) {
  const school = schools[i];
  const aliases = school.alias
    .split(/[,;|/]+/)
    .map((alias) => alias.toUpperCase().trim())
    .filter((alias) => alias.length > 0);

  const cleanedSchool = { id: school.id, name: school.name.toUpperCase() };
  if (aliases.length > 0) cleanedSchool.aliases = aliases;
  cleanedSchools.push(cleanedSchool);
}

fs.writeFile("cleanedSchools.json", JSON.stringify(cleanedSchools, null, 2), "utf-8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("cleanedSchools has been written to cleanedSchools.json");
  }
});
