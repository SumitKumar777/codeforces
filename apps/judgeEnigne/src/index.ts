import "./consumer/consumer.js";

import fs from "fs";



fs.readFile("./submission/dummysubmission.json","utf-8",(err,stream)=>{
  try {
     if (err) {
        console.log(err)
     } else {
        console.log(stream)
     }
  } catch (error) {
   console.log("error in reading file",error);
  }
})
