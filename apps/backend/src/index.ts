import type  {Express} from "express";
import express from "express";
import { codeExecRouter } from "./codeExec/code.js";
import { sharedApiRouter } from "./shared/shared.js";
import { adminRouter } from "./admin/admin.js";
import cors from "cors"

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use(cors({ origin:"http://localhost:3000",credentials:true }))

app.get("/",(req,res)=>{
  res.send("hi from the server");
})

app.use("/code",codeExecRouter);
app.use("/shared",sharedApiRouter);
app.use("/admin",adminRouter);


app.use("",(req, res)=>{
  console.log("invalid router");
  return res.send("invalid route please check the route")
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});