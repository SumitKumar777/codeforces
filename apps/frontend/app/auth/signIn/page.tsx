"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

import { signIn } from "@/app/lib/auth-client";

const formSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export default function Signin() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values);

			if (!values.email || !values.password) {
				throw new Error("Email and password are required");
			}

			await signIn.email({
				email: values.email,
				password: values.password,
				callbackURL: "/dashboard",
			});

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
