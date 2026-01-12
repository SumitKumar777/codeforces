import  type { Express } from "express";

import express, { Router } from "express";
import { success } from "zod";

export const sharedApiRouter= Router();


// quesiton view kr paye  - endpoint will send the questions;


// endpoint single question details - means in the conding submission panel use

sharedApiRouter.get("/problem/:problemId", async (req, res)=>{
   try {
      const { problemId } = req.params;
      if (!problemId) {
         throw new Error('problemId is missing');
      }

      const problemDetails= await prisma?.problems.findUnique({
         where:{
            id:Number(problemId)
         },select:{
            id:true,
            title:true,
            description:true,
            visibleTestCase:true
         }
      })

      res.json({success:true,data:problemDetails})

   } catch (error) {
      console.log("error while getting the problem",error);
      res.json({success:false,error:error})
   }
})


// multitple question list with only title and id 

sharedApiRouter.get("/questionList",async (req,res)=>{
   try {

      const getProblems= await prisma?.problems.findMany({take:10});
      res.json({ success: true, data: getProblems })

   } catch (error) {
      console.log("error while getting the problem", error);
      res.json({ success: false, error: error })
   }
})

// admin details



// own details



