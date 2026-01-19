import CodeIde from "@/components/custom/codeIde";
import ProblemRenderer from "@/components/custom/problemRenderer";
import { ApiResponseSchema, ProblemDetailsSchema } from "@repo/types";



const fetchProblem = async (problemId: string) => {
   try{
      const response = await fetch(
				`http://localhost:3001/shared/problem/${problemId}`
			);
      const data = await response.json();
      console.log(data);
      const parsedData= ApiResponseSchema(ProblemDetailsSchema).parse(data);
      if(!parsedData){
         throw new Error("problem data parsing failed");
      }
      console.log("fetched problem data:", parsedData);
      return parsedData;
   } catch (error) {
      console.error("Error fetching problem:", error);
      return null;
   }
};

async function SolvePage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug: problemId } = await params;


   const problemData = await fetchProblem(problemId);
   
   
   return (
			<div>
				<h1>solve the problem</h1>
				{problemData && problemData.success ? (
               <div className="flex w-auto">
                  <ProblemRenderer problem={problemData.data} />
                  <CodeIde />
               </div>
            ) : (
               <p>Problem not found.</p>
            )}
			</div>
		);
}

export default SolvePage;