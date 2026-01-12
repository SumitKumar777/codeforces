import express from "express";
import { Router } from "express";
import prisma from "@repo/db";
import { success } from "zod";

export const adminRouter = Router();

type TestCase = {
	input: string;
	output: string;
};

type CreateQuestionBody = {
	title: string;
	description: string;
	visibleTestCase: TestCase[];
	hiddenTestCase: TestCase[];
};

// quesiton set kr paye -> endpoint will receive the data from the user and set that in the database ?

adminRouter.post("/create-question", async (req, res) => {
	// body will receive title as string description as string which was markdown
	// visibleTestCase and hidden test Case if the user wants to add it then only  as string
	try {
		const body: CreateQuestionBody = req.body;
		const id = "asdf";

		if (
			!body.title ||
			!body.description ||
			!body.visibleTestCase ||
			!body.hiddenTestCase
		) {
			throw new Error("request body missing for Creating question for admin");
		}

		const createQues = await prisma.$transaction(async (tx) => {
			// add question
			const problemId = await tx.problems.create({
				data: {
					title: body.title,
					description: body.description,
					//!get the correct admin id by setting it in the requst body object in middleware
					adminId: id,
				},
				select: {
					id: true,
				},
			});

			// list we will get the input and output as object which will be in array because a question can multiple input and output so we can just store it as whole

			await tx.visibleTestCase.createMany({
				data: body.visibleTestCase.map((tc, index) => ({
					problemId: problemId.id,
					input: tc.input,
					output: tc.output,
					order: index,
				})),
			});

			//  now create the hidden text case
			await tx.hiddenTestCase.createMany({
				data: body.hiddenTestCase.map((tc, index) => ({
					problemId: problemId.id,
					input: tc.input,
					output: tc.output,
					order: index,
				})),
			});
		});

      res.json({success:true, message:"problem created Successfully "});
	} catch (error) {
		console.log("erro while creating problem", error);
		res.json({
			success: false,
			message: "failed problem creation",
			error: error,
		});
	}
});


// modify means add test cases of description

adminRouter.put("/question-modify/:questionId", (req, res) => {});

// delete the question

adminRouter.delete("/question-delete/:questionId", (req, res) => {});

// admin details
