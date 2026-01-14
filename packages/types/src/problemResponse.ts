


import { z } from "zod";

export const VisibleTestCaseSchema = z.object({
   id: z.string(),
   input: z.string(),
   output: z.string(),
});

export const ProblemDetailsSchema = z.object({
   id: z.number(),
   title: z.string(),
   description: z.string(),
   inputStatement: z.string(),
   outputStatement: z.string(),
   visibleTestCase: z.array(VisibleTestCaseSchema),
});

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(schema: T) =>
   z.object({
      success: z.literal(true),
      data: schema,
   });

export const ApiErrorSchema = z.object({
   success: z.literal(false),
   error: z.string(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
   z.union([ApiSuccessSchema(schema), ApiErrorSchema]);


export type VisibleTestCase = z.infer<typeof VisibleTestCaseSchema>;

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;


export type ApiSuccess<T> = {
   success: true;
   data: T;
};

export type ApiError = {
   success: false;
   error: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
