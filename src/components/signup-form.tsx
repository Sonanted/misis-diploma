import { type ComponentProps, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { PhoneInput } from './phone-input';

export function SignupForm({ ...props }: ComponentProps<typeof Card>) {
	const [phoneNumber, setPhoneNumber] = useState('');

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
							<FieldLabel htmlFor="name">
								First name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id="name" type="text" placeholder="John" required />
						</Field>

						<Field>
							<FieldLabel htmlFor="name">
								Last Name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id="name" type="text" placeholder="Doe" required />
						</Field>

						<Field>
							<FieldLabel htmlFor="phone">
								Phone <span className="text-destructive">*</span>
							</FieldLabel>
							<PhoneInput
								id="phone"
								value={phoneNumber}
								onChange={setPhoneNumber}
								international
								defaultCountry="RU"
								placeholder="Enter a phone number"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input id="email" type="email" placeholder="m@example.com" />
						</Field>

						<Field>
							<FieldLabel htmlFor="password">
								Password <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id="password" type="password" required />
							<FieldDescription>Must be at least 8 characters long.</FieldDescription>
						</Field>

						<Field>
							<FieldLabel htmlFor="confirm-password">
								Confirm Password <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id="confirm-password" type="password" required />
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
