import { Router } from "express";

export const adminRouter = Router();

import prisma from "@repo/db";

import { formSchema } from "@repo/types";
import { z } from "zod";

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

const siginScehma = z.object({
	name: z.string().min(1),
	email: z.email(),
	password: z.string().min(4),
});

adminRouter.post("/signin", async (req, res) => {
	try {
		const body = siginScehma.safeParse(req.body);
		if (!body.success) {
			console.log("body is ", body.data);
			throw new Error("invalid signin request body ")
		}

		const { data } = body

		const findAdmin = await prisma.admin.findUnique({
			where: {
				email: data.email
			}
		})

		if (!findAdmin) {
			// create new admin
			const createAdmin = await prisma.admin.create({
				data: {
					name: data.name,
					email: data.email,

				}
			})

			return res.json({ success: true, message: "admin created successfully", admin: createAdmin })
		}
		return res.json({ success: true, message: "admin signed in successfully", admin: findAdmin })



	} catch (error) {
		console.log("error in admin signin ", error);
		res.json({ success: false, message: "admin signin failed", error: error });

	}


});

// quesiton set kr paye -> endpoint will receive the data from the user and set that in the database ?

adminRouter.post("/create-question", async (req, res) => {
	// body will receive title as string description as string which was markdown
	// visibleTestCase and hidden test Case if the user wants to add it then only  as string
	try {
		const body = formSchema.safeParse(req.body);

		if (!body.success) {
			console.log("body is ", body);
			throw new Error("request body is invalid");
		}

		const { data } = body;

		console.log("data is ", body);

		const problemSlug = data.problem_Title.trim().toLowerCase().replace(/\s+/g, "-");

		const createQues = await prisma.$transaction(async (tx) => {
			// add question
			const problemId = await tx.problems.create({
				data: {
					title: data.problem_Title,
					description: data.problem_description,
					problem_slug: problemSlug,
					constraints: data.constraints,
					inputStatement: data.input_statement,
					outputStatement: data.output_statement,
					//!get the correct admin id by setting it in the requst body object in middleware
					adminId: "34562f3b-8335-445c-b983-40c03050e3aa",

				},
				select: {
					id: true,
				},
			});

			// list we will get the input and output as object which will be in array because a question can multiple input and output so we can just store it as whole

			await tx.visibleTestCase.createMany({
				data: data.visibleTestCases.map((tc, index) => ({
					problemId: problemId.id,
					input: tc.input,
					expected_output: tc.output,
					order: index,
				})),
			});

			//  now create the hidden text case
			await tx.hiddenTestCase.createMany({
				data: data.hiddenTestCases.map((tc, index) => ({
					problemId: problemId.id,
					input: tc.input,
					expected_output: tc.output,
					order: index,
				})),
			});
		});

		res.json({ success: true, message: "problem created Successfully " });
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

adminRouter.put("/question-modify/:questionId", (req, res) => { });

// delete the question

adminRouter.delete("/question-delete/:questionId", (req, res) => { });

// admin details
