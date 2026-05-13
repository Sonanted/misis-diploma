import { type ComponentProps, useId, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';

export default function Signup({ ...props }: ComponentProps<typeof Card>) {
	const [phoneNumber, setPhoneNumber] = useState('');

	const firstNameInputId = useId();
	const lastNameInputId = useId();
	const phoneInputId = useId();
	const emailInputId = useId();
	const passwordInputId = useId();
	const confirmPasswordInputId = useId();

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>Enter your information below to create your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={firstNameInputId}>
								First name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={firstNameInputId} type="text" placeholder="John" required />
						</Field>

						<Field>
							<FieldLabel htmlFor={lastNameInputId}>
								Last Name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={lastNameInputId} type="text" placeholder="Doe" required />
						</Field>

						<Field>
							<FieldLabel htmlFor={phoneInputId}>
								Phone <span className="text-destructive">*</span>
							</FieldLabel>
							<PhoneInput
								id={phoneInputId}
								value={phoneNumber}
								onChange={setPhoneNumber}
								international
								defaultCountry="RU"
								placeholder="Enter a phone number"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={emailInputId}>Email</FieldLabel>
							<Input id={emailInputId} type="email" placeholder="m@example.com" />
						</Field>

						<Field>
							<FieldLabel htmlFor={passwordInputId}>
								Password <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={passwordInputId} type="password" required />
							<FieldDescription>Must be at least 8 characters long.</FieldDescription>
						</Field>

						<Field>
							<FieldLabel htmlFor={confirmPasswordInputId}>
								Confirm Password <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={confirmPasswordInputId} type="password" required />
							<FieldDescription>Please confirm your password.</FieldDescription>
						</Field>

						<Field>
							<Button type="submit">Create Account</Button>

							<FieldDescription className="px-6 text-center">
								Already have an account? <Link to="/login">Sign in</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
