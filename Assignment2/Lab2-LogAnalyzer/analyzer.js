const fs = require("fs");
const readline = require("readline");

let errorCount=0;
let infoCount=0;

const rl = readline.createInterface({
 input: fs.createReadStream("server.log"),
});

rl.on("line",(line)=>{
 if(line.includes("ERROR")) errorCount++;
 if(line.includes("INFO")) infoCount++;
});

rl.on("close",()=>{
 console.log("Errors:",errorCount);
 console.log("Info:",infoCount);
});
