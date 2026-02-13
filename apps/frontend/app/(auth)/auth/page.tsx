"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/app/lib/auth-client";

const signinSchema = z.object({
	email: z.email(),
	password: z.string(),
});

const signupSchema = z.object({
	name: z.string().min(1).min(4).max(50),
	email: z.email(),
	password: z.string().min(6).max(100),
});

type AuthFormValues = {
	name?: string;
	email: string;
	password: string;
};

export default function AuthPage() {
	const searchParams = useSearchParams();
	const isSignup = searchParams.get("mode") === "signup";

	const form = useForm<AuthFormValues>({
		resolver: zodResolver(isSignup ? signupSchema : signinSchema),
	});

	useEffect(() => {
		form.reset();
	}, [isSignup, form]);

	async function onSubmit(values: AuthFormValues) {
		try {
			if (!values.email || !values.password) {
				throw new Error("Email and password are required");
			}

			if (isSignup) {
				if (!values.name) {
					throw new Error("All fields are required");
				}

				const response = await signUp.email({
					name: values.name,
					email: values.email,
					password: values.password,
					callbackURL: "/auth?mode=signin",
				});

				if (response.error) {
					throw new Error(JSON.stringify(response.error));
				}
			} else {
				await signIn.email({
					email: values.email,
					password: values.password,
					callbackURL: "/dashboard",
				});
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

	const handleGoogleSignIn = async () => {
		console.log("Google sign-in initiated");
		try {
			await signIn.social({
				provider: "google",
				callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
			});
		} catch (error) {
			console.error("Google sign-in error", error);
			toast.error("Failed to sign in with Google. Please try again.");
		}
	};

	return (
		<div className="max-w-md mx-auto">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8  py-10"
				>
					{isSignup ? (
						<Field>
							<FieldLabel htmlFor="name">Username</FieldLabel>
							<Input
								id="name"
								placeholder="Enter your name"
								{...form.register("name")}
							/>
							<FieldError>{form.formState.errors.name?.message}</FieldError>
						</Field>
					) : null}

					<Field>
						<FieldLabel htmlFor="email">Email</FieldLabel>
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

					<Button type="submit" className="bg-amber-600">
						Submit
					</Button>

					<div className="text-sm text-muted-foreground">
						{isSignup ? (
							<>
								Already have an account?{" "}
								<Link
									className="text-foreground underline"
									href="/auth?mode=signin"
								>
									Sign in
								</Link>
							</>
						) : (
							<>
								Don&#39;t have an account?{" "}
								<Link
									className="text-foreground underline"
									href="/auth?mode=signup"
								>
									Sign up
								</Link>
							</>
						)}
					</div>
				</form>
			</Form>
			<div className="space-y-1">
				<p className="text-sm font-light text-gray-400">
					{isSignup ? "or you can signup with" : "or you can signin with"}
				</p>
				<Button onClick={handleGoogleSignIn}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path d="M500 261.8C500 403.3 403.1 504 260 504 122.8 504 12 393.2 12 256S122.8 8 260 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9c-88.3-85.2-252.5-21.2-252.5 118.2 0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9l-140.8 0 0-85.3 236.1 0c2.3 12.7 3.9 24.9 3.9 41.4z" />
					</svg>
				</Button>
			</div>
		</div>
	);
}
