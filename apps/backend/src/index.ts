import type  {Express, Response} from "express";
import express from "express";
import { codeExecRouter } from "./codeExec/code.js";
import { sharedApiRouter } from "./shared/shared.js";
import { adminRouter } from "./admin/admin.js";
import cors from "cors"
import  "./codeExec/consumer/consumer.js";

const app: Express = express();
const PORT = process.env.PORT || 3001;

export const userConnection:Map<string,Response>= new Map();

app.use(express.json());

app.use(cors({ origin:"http://localhost:3000",credentials:true }))

app.get("/",(req,res)=>{
  res.send("hi from the server");
})

app.use("/code",codeExecRouter);
app.use("/shared",sharedApiRouter);
app.use("/admin",adminRouter);

app.get('/events', (req, res) => {

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');


  res.write(`data: Connected to server\n\n`);
  
  // When client closes connection, stop sending events
  req.on('close', () => {
    res.end();
  });
});



app.use("",(req, res)=>{
  console.log("invalid router");
  return res.send("invalid route please check the route")
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});