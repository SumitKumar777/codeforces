import { z } from "zod";
export * from "./problemResponse.js";

export const problemSchema = z.object({
   problem_Title: z
      .string()
      .min(5, "Problem title must be at least 5 characters"),

   problem_description: z
      .string()
      .min(10, "Problem description is too short"),

   input_statement: z
      .string()
      .min(1, "Input statement cannot be empty"),

   output_statement: z
      .string()
      .min(1, "Output statement cannot be empty"),

   visible_testCase: z
      .string()
      .min(1, "Visible test case is required"),

   visible_output: z
      .string()
      .min(1, "Visible output is required"),

   hidden_testCase: z
      .string()
      .min(1, "Hidden test case is required"),

   hidden_output: z
      .string()
      .min(1, "Hidden output is required"),
});


const testCaseSchema = z.object({
   input: z.string().min(1, "Input is required"),
   output: z.string().min(1, "Output is required"),
});

export const formSchema = z.object({
   problem_Title: z.string().min(3).max(80),
   problem_slug: z.string().min(3).max(80),
   constraints: z.string().max(10000),
   problem_description: z.string().max(10000),
   input_statement: z.string().max(10000),
   output_statement: z.string().max(10000),

   visibleTestCases: z.array(testCaseSchema).min(1),
   hiddenTestCases: z.array(testCaseSchema).min(1),
});

export type FormValues = z.infer<typeof formSchema>;
