import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {spawn} from "child_process";
import { Router } from "express";
import { fileURLToPath } from "url";
import { runUserCode } from "./exec.js";



export const codeExecRouter=Router();



// user and admin submit kr paye fir woh code run krega and check hoga each and every test case if good then continue to last test case if not then return early and show the user 


 codeExecRouter.post("/submit",async (req,res)=>{
   // user code details fetch from the database and execute teh code and check the result 
   try {
     const {id,problemId,code,language }= req.body;

     if(!id || !problemId || !code || !language){
       throw new Error("missing required fields");
     }


    //  fetch problem details from the database using problemId
     
     const problemDetails= await prisma?.problems.findUnique({
      where:{
        id:Number(problemId)
      },
      select:{
        id:true,
        visibleTestCase: true,
        hiddenTestCase: true
      }
     })
      if(!problemDetails){
        throw new Error("problem not found");
      }

      const allTestCases= [...problemDetails.visibleTestCase,...problemDetails.hiddenTestCase].map((tc, index)=>({
        ...tc,
        order : index + 1
      }))

      console.log("all testCases => ",allTestCases);


      const submissionId= randomUUID();

      const filePath= path.join("/tmp", `${submissionId}.js`);

      console.log("filepath", filePath);

     fs.writeFileSync(filePath, code);

     for(const tc of allTestCases){
      console.log('tc input', tc.input);
       const result = await runUserCode(filePath, tc.input);

       console.log("user code result => ", result);

       if(result instanceof Error){
        throw result;
       }

       if(result.exitCode !==0){
        throw new Error(`runtime error on test case ${tc.order} with stderr: ${result.stderr}`);
       }

       const userOutput= result.stdout.trim();
       const expectedOutput= tc.output.trim();

       if(userOutput !== expectedOutput){

        throw new Error(`wrong answer on test case ${tc.order}. expected: ${expectedOutput}, got: ${userOutput}`);
       }
     }


    res.json({status:true,message:"successfully executed"});

   } catch (error) {
    console.log("error while submition",error);
    res.json({status:false,message:"failed while executing"});
   }
 })







