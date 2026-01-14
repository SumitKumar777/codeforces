"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import axios from "axios";

const formSchema = z.object({
  problem_Title: z.string().min(1).min(3).max(80),
  problem_description: z.string(),
  input_statement: z.string().min(5).max(10000),
  output_statement: z.string().min(5).max(10000),
  visible_testCase: z.string().min(1).max(1000),
  visible_output: z.string().min(1).max(100000),
  hidden_testCase: z.string().min(1).max(1000),
  hidden_output: z.string().min(1).max(1000),
});

export default function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);

      await axios.post("/api/problems", values);
      
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-10">
      <div className="max-w-3xl w-full mx-4">
        <div className="bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold mb-8 text-center bg-linear-to-r to-purple-600 dark:to-purple-400 bg-clip-text text-transparent">
            Create Problem
          </h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <Field>
              <FieldLabel htmlFor="problem_Title">problem name</FieldLabel>
              <Input
                id="problem_Title"
                placeholder="Enter problem name"
                {...form.register("problem_Title")}
              />
              <FieldDescription>input for problem name</FieldDescription>
              <FieldError>
                {form.formState.errors.problem_Title?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="problem_description">
                Problem Description
              </FieldLabel>
              <Input
                id="problem_description"
                placeholder="Enter problem description"
                {...form.register("problem_description")}
              />
              <FieldDescription>
                file input for problem description
              </FieldDescription>
              <FieldError>
                {form.formState.errors.problem_description?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="input_statement">Input statement</FieldLabel>
              <Textarea
                id="input_statement"
                placeholder="Enter the input statement description"
                {...form.register("input_statement")}
              />
              <FieldDescription>Input statement description</FieldDescription>
              <FieldError>
                {form.formState.errors.input_statement?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="output_statement">Ouput Statement</FieldLabel>
              <Textarea
                id="output_statement"
                placeholder="Enter the output description"
                {...form.register("output_statement")}
              />
              <FieldDescription className="text-3xl pt-10 mt-10">
                Description about output statement
              </FieldDescription>
              <FieldError>
                {form.formState.errors.output_statement?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="visible_testCase">
                visible testcase
              </FieldLabel>
              <Textarea
                id="visible_testCase"
                placeholder="Enter the Visible test case"
                {...form.register("visible_testCase")}
              />
              <FieldDescription>visible test inputs </FieldDescription>
              <FieldError>
                {form.formState.errors.visible_testCase?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="visible_output">visible outputs</FieldLabel>
              <Textarea
                id="visible_output"
                placeholder="Enter visible output of test case"
                {...form.register("visible_output")}
              />
              <FieldDescription>Visible output description</FieldDescription>
              <FieldError>
                {form.formState.errors.visible_output?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="hidden_testCase">
                Hidden test Case
              </FieldLabel>
              <Textarea
                id="hidden_testCase"
                placeholder="Enter Hidden test case"
                {...form.register("hidden_testCase")}
              />
              <FieldDescription>
                Description about hidden testcase
              </FieldDescription>
              <FieldError>
                {form.formState.errors.hidden_testCase?.message}
              </FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="hidden_output">
                Hidden testCase inputs
              </FieldLabel>
              <Textarea
                id="hidden_output"
                placeholder="Enter hidden Test Case output"
                {...form.register("hidden_output")}
              />
              <FieldDescription>Hidden Test Case </FieldDescription>
              <FieldError>
                {form.formState.errors.hidden_output?.message}
              </FieldError>
            </Field>
            <Button
              type="submit"
              size="lg"
              className="px-6! py-3! text-lg hover:scale-105 transition-transform duration-200"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
