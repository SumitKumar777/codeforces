import { Router } from "express";

export const sharedApiRouter = Router();

import { ProblemDetailsSchema, ApiResponseSchema } from "@repo/types";

// quesiton view kr paye  - endpoint will send the questions;

// endpoint single question details - means in the conding submission panel use

sharedApiRouter.get("/problem/:problemId", async (req, res) => {
	try {
		console.log("req params", req.params);
		const { problemId } = req.params;
		console.log("requested problem id ", problemId);
		if (!problemId) {
			throw new Error("problemId is missing");
		}

		const problemDetails = await prisma?.problems.findUnique({
			where: {
				id: Number(problemId),
			},
			select: {
				id: true,
				title: true,
				description: true,
				inputStatement: true,
				outputStatement: true,
				constraints: true,
				visibleTestCase: {
					take: 2,
					orderBy: {
						order: "asc",
					},
					select: {
						id: true,
						input: true,
						expected_output: true,
					},
				},
			},
		});

		console.log("problem details from db", problemDetails);

		const parsedData = ProblemDetailsSchema.parse(problemDetails);
		if (!parsedData) {
			throw new Error("problem details parsing failed");
		}


		res.json({ success: true, data: parsedData });
	} catch (error) {
		console.log("error while getting the problem", error);
		res.json({ success: false, error: error });
	}
});

// multitple question list with only title and id

sharedApiRouter.get("/problemList", async (req, res) => {
	try {
		const getProblems = await prisma?.problems.findMany({
			take: 5,
			select: {
				id: true,
				title: true,
			},
		});
		res.json({ success: true, data: getProblems });
	} catch (error) {
		console.log("error while getting the problem", error);
		res.json({ success: false, error: error });
	}
});

// admin details

// own details
