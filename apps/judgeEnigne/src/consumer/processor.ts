

import {prisma} from "@repo/db"




interface CodeExecuteDetails{
   
   problemId: number ;
   userCode: string;
   language: string;
   testCases: {
      order: number;
      problemId: number;
      id: string;
      input: string;
      output: string;
   } [];
}




const executeUserCode= (codeExecDetails:CodeExecuteDetails)=>{
   
}



export async function problemProcessor(submissionId:string){
   try {

      const submissionDetails= await prisma.$transaction(async(tx)=>{

         const submissionDetails = await tx.submissions.findUnique({
            where: {
               id: submissionId
            }, select: {
               problemId: true,
               code:true,
               language:true
            }
         })

         if(!submissionDetails){
            throw new Error("submissionDetails not found ProblemProcessor");
         }

         const problemDetails = await tx.problems.findUnique({
            where: {
               id: submissionDetails.problemId
            }, select: {
               id: true,
               visibleTestCase: true,
               hiddenTestCase: true
            }
         })
         return {
            problemId:problemDetails?.id,
            userCode:submissionDetails.code,
            language:submissionDetails.language,
            testCases:[...(problemDetails?.hiddenTestCase) ?? [], ...(problemDetails?.visibleTestCase) ?? []].map((tc,index)=>({
               ...tc,
               order:index+1
            }))
            
         }
      })

      if(!submissionDetails){
         throw new Error("submission details are missing");
      }



   } catch (error) {
      
   }
}