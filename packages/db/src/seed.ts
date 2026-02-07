import prisma from "./index.js";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



async function main() {
   const admin = await prisma.admin.upsert({
      where: { email: "admin@codeforces.com" },
      update: { name: "Admin User" },
      create: { email: "admin@codeforces.com", name: "Admin User" }
   });

   const distProblemSetPath = join(__dirname, "problemSet", "dummyProblemSet.json");
   const distTestcasePath = join(__dirname, "problemSet", "dummyTestcase.json");
   const srcProblemSetPath = join(__dirname, "..", "..", "src", "problemSet", "dummyProblemSet.json");
   const srcTestcasePath = join(__dirname, "..", "..", "src", "problemSet", "dummyTestcase.json");

   const problemSetPath = fs.existsSync(distProblemSetPath) ? distProblemSetPath : srcProblemSetPath;
   const testcasePath = fs.existsSync(distTestcasePath) ? distTestcasePath : srcTestcasePath;

   if (!fs.existsSync(problemSetPath) || !fs.existsSync(testcasePath)) {
      console.error(`Data files not found at ${problemSetPath} or ${testcasePath}`);
      return;
   }

   const problemSetData = JSON.parse(fs.readFileSync(problemSetPath, "utf-8"));
   const testcaseData = JSON.parse(fs.readFileSync(testcasePath, "utf-8"));

   const hiddenTestcaseMap = new Map<string, any>();
   for (const t of testcaseData) {
      hiddenTestcaseMap.set(String(t.problem_id), t);
   }

   for (let i = 0; i < problemSetData.length; i++) {
      const pData = problemSetData[i];
      const problemIndex = i + 1;
      const visibleTestCaseData = (pData.visibleTestCases || []).map((vt: any, index: number) => ({
         input: vt.input,
         expected_output: vt.output,
         order: vt.order || index + 1
      }));

      const existingProblem = await prisma.problems.findFirst({
         where: { problem_slug: pData.problem_slug }
      });

      const problem = existingProblem
         ? await prisma.problems.update({
            where: { id: existingProblem.id },
            data: {
               adminId: admin.id,
               title: pData.title,
               description: pData.description,
               inputStatement: pData.inputStatement,
               outputStatement: pData.outputStatement,
               constraints: pData.constraints,
               visibleTestCase: {
                  deleteMany: {},
                  create: visibleTestCaseData
               }
            }
         })
         : await prisma.problems.create({
            data: {
               adminId: admin.id,
               title: pData.title,
               problem_slug: pData.problem_slug,
               description: pData.description,
               inputStatement: pData.inputStatement,
               outputStatement: pData.outputStatement,
               constraints: pData.constraints,
               visibleTestCase: {
                  create: visibleTestCaseData
               }
            }
         });

      const hiddenTestObj = hiddenTestcaseMap.get(String(problemIndex));
      const hiddenCases = hiddenTestObj?.testcases || [];

      await prisma.hiddenTestCase.deleteMany({
         where: { problemId: problem.id }
      });

      if (hiddenCases.length > 0) {
         const hiddenData = hiddenCases.map((ht: any, index: number) => ({
            input: ht.input,
            expected_output: ht.expected_output,
            order: index + 1,
            problemId: problem.id
         }));

         await prisma.hiddenTestCase.createMany({
            data: hiddenData
         });
      }
   }

   console.log("Seeding finished.");
}

main()
   .then(async () => {
      await prisma.$disconnect()
   })
   .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
   })