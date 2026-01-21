"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/app/lib/auth-client";

const formSchema = z.object({
	name: z.string().min(1).min(4).max(50),
	email: z.string(),
	password: z.string().min(5).max(100),
});

export default function Signup() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values);
			if (!values.name || !values.email || !values.password) {
				throw new Error("All fields are required");
			}
			console.log("Calling signUp.email with:", values);
			const response = await signUp.email({
				name: values.name,
				email: values.email,
				password: values.password,
            callbackURL:"/auth/signIn"
			});

			console.log("signUp response:", response);

			if (response.error) {
				throw new Error(JSON.stringify(response.error));
			}
			toast(
				<pre className="mt-2 w-85 rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(values, null, 2)}</code>
				</pre>,
			);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 max-w-3xl mx-auto py-10"
			>
				<Field>
					<FieldLabel htmlFor="name">Username</FieldLabel>
					<Input
						id="name"
						placeholder="Enter you name"
						{...form.register("name")}
					/>

					<FieldError>{form.formState.errors.name?.message}</FieldError>
				</Field>
				<Field>
					<FieldLabel htmlFor="email">Emai</FieldLabel>
					<Input
						id="email"
						placeholder="Rahul782@gmail.com"
						{...form.register("email")}
					/>

					<FieldError>{form.formState.errors.email?.message}</FieldError>
				</Field>
				<Field>
					<FieldLabel htmlFor="password">Password</FieldLabel>
					<Input
						id="password"
						placeholder="2hsa@#sdhd3"
						{...form.register("password")}
					/>

					<FieldError>{form.formState.errors.password?.message}</FieldError>
				</Field>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
