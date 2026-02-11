import prisma from "@repo/db"



// {
//   "submission_id": "test-001",
//     "problem_id": 1,
//       "language": "CPP",
//         "code": "#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    if (!(cin >> a >> b)) return 0;\n    cout << a + b;\n    return 0;\n}",
//   "testcases": [
//     { "input": "2 3\n", "expected_output": "5" },
//     { "input": "100 200\n", "expected_output": "300" },
//     { "input": "-10 -20\n", "expected_output": "-30" }
//   ]
// },



const createSubmissionObject = async (submissionId: string) => {
   try {
      const submissionData = await prisma.submissions.findUnique({
         where: { id: submissionId }
      });

      if (!submissionData) {
         throw new Error(`Submission with id ${submissionId} not found`);
      }

      const problemData = await prisma.problems.findUnique({
         where: { id: submissionData.problemId },
         include: {
            visibleTestCase: true,
            hiddenTestCase: true
         }
      });

      if (!problemData) {
         throw new Error(`Problem with id ${submissionData.problemId} not found`);
      }

      const testcases = [
         ...problemData.visibleTestCase.map((testcase) => ({
            input: testcase.input,
            expected_output: testcase.expected_output
         })),
         ...problemData.hiddenTestCase.map((testcase) => ({
            input: testcase.input,
            expected_output: testcase.expected_output
         }))
      ];

      return {
         submission_id: submissionData.id,
         problem_id: (submissionData.problemId).toString(),
         language: submissionData.language,
         code: submissionData.code,
         testcases
      };
   } catch (error) {
      console.error("Error fetching testcases for submission", submissionId, error);
      throw error;
   }
};

export default createSubmissionObject;

