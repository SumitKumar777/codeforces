"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
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
import { FormValues, formSchema } from "@repo/types";





export default function MyForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			visibleTestCases: [{ input: "", output: "" }],
			hiddenTestCases: [{ input: "", output: "" }],
		},
	});

	const {
		fields: visibleFields,
		append: addVisible,
		remove: removeVisible,
	} = useFieldArray({
		control: form.control,
		name: "visibleTestCases",
	});

	const {
		fields: hiddenFields,
		append: addHidden,
		remove: removeHidden,
	} = useFieldArray({
		control: form.control,
		name: "hiddenTestCases",
	});

	async function onSubmit(values: FormValues) {
		try {
			console.log(values);
			const quesCreatRes=await axios.post("http://localhost:3001/admin/create-question", values);
			if(quesCreatRes.data.success !== true){
				throw new Error("problem creation failed")
			}else{
				toast.success("Problem created successfully");
				 form.reset({
						problem_Title: "",
						problem_description: "",
						input_statement: "",
						output_statement: "",
						visibleTestCases: [{ input: "", output: "" }],
						hiddenTestCases: [{ input: "", output: "" }],
					});
			}
			
		} catch (err) {
			console.error(err);
			toast.error("Submission failed");
		}
	}

	return (
		<div className="min-h-screen flex justify-center pt-10">
			<div className="max-w-3xl w-full">
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


					<Field>
						<FieldLabel>Problem Title</FieldLabel>
						<Input {...form.register("problem_Title")} />
						<FieldError>
							{form.formState.errors.problem_Title?.message}
						</FieldError>
					</Field>

					<Field>
						<FieldLabel>Problem Description</FieldLabel>
						<Textarea {...form.register("problem_description")} />
					</Field>

					<Field>
						<FieldLabel>Input Statement</FieldLabel>
						<Textarea {...form.register("input_statement")} />
					</Field>

					<Field>
						<FieldLabel>Output Statement</FieldLabel>
						<Textarea {...form.register("output_statement")} />
					</Field>



					<h2 className="text-xl font-semibold">Visible Test Cases</h2>

					{visibleFields.map((field, index) => (
						<div key={field.id} className="border p-4 rounded-md space-y-3">
							<Textarea
								placeholder="Input"
								{...form.register(`visibleTestCases.${index}.input`)}
							/>
							<Textarea
								placeholder="Output"
								{...form.register(`visibleTestCases.${index}.output`)}
							/>

							<Button
								type="button"
								variant="destructive"
								onClick={() => removeVisible(index)}
							>
								Remove
							</Button>
						</div>
					))}

					<Button
						type="button"
						onClick={() => addVisible({ input: "", output: "" })}
					>
						+ Add Visible Test Case
					</Button>



					<h2 className="text-xl font-semibold">Hidden Test Cases</h2>

					{hiddenFields.map((field, index) => (
						<div key={field.id} className="border p-4 rounded-md space-y-3">
							<Textarea
								placeholder="Input"
								{...form.register(`hiddenTestCases.${index}.input`)}
							/>
							<Textarea
								placeholder="Output"
								{...form.register(`hiddenTestCases.${index}.output`)}
							/>

							<Button
								type="button"
								variant="destructive"
								onClick={() => removeHidden(index)}
							>
								Remove
							</Button>
						</div>
					))}

					<Button
						type="button"
						onClick={() => addHidden({ input: "", output: "" })}
					>
						+ Add Hidden Test Case
					</Button>



					<Button type="submit" size="lg">
						Submit
					</Button>
				</form>
			</div>
		</div>
	);
}
