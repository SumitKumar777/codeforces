

import { Router } from "express";


import { apiClient } from "@repo/redis-client";

export const codeExecRouter = Router();

// user and admin submit kr paye fir woh code run krega and check hoga each and every test case if good then continue to last test case if not then return early and show the user

codeExecRouter.post("/submit", async (req, res) => {
  // user code details fetch from the database and execute teh code and check the result
  try {
    const { id, problemId, code, language } = req.body;

    if (!id || !problemId || !code || !language) {
      throw new Error("missing required fields");
    }
    const createSubmission = await prisma?.$transaction(async (tx) => {
      const findProblem = await tx.problems.findUnique({
        where: {
          id: Number(problemId),
        }, select: {
          visibleTestCase: {
            select: {
              input: true,
              expected_output: true
            }
          },
          hiddenTestCase: {
            select: {
              input: true,
              expected_output: true
            }
          }
        }
      });

      if (!findProblem) {
        throw new Error("problem not found");
      }



      return tx.submissions.create({
        data: {
          userId: id,
          problemId: Number(problemId),
          code,
          language,
          state: "PENDING",
        },
      });

    });
    if (!createSubmission) {
      throw new Error("submission creation failed");
    }


    console.log("submission created with id ", createSubmission);

    // {
    //   "submission_id": "test-001",
    //     "problem_id": 1,
    //       "language": "CPP",
    //         "code": "#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    if (!(cin >> a >> b)) return 0;\n    cout << a + b;\n    return 0;\n}",
    //           "limits": {
    //     "time_seconds": 1,
    //       "memory_mb": 128
    //   },
    //   "testcases": [
    //     { "input": "2 3\n", "expected_output": "5" },
    //     { "input": "100 200\n", "expected_output": "300" },
    //     { "input": "-10 -20\n", "expected_output": "-30" }
    //   ]
    // },

    const writeClient = await apiClient.getApiWriteRedisClient();

    const pushDataToStream = await writeClient.xAdd(
      "submissionStream",
      "*",
      {
        submission: JSON.stringify({

        })
      }
    );


    console.log("pushed data to stream with id ", pushDataToStream);

    res.json({ status: true, message: "submission received", data: createSubmission });


  } catch (error) {
    console.log("error while submition", error);
    res.json({ status: false, message: "failed while executing" });
  }
});

