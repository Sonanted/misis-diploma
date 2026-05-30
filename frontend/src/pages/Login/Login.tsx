import { type ComponentProps, useId, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';

export default function Login({ ...props }: ComponentProps<'div'>) {
	const [phoneNumber, setPhoneNumber] = useState('');

	const phoneInputId = useId();
	const passwordInputId = useId();

	return (
		<Card>
			<CardHeader {...props}>
				<CardTitle>Login to your account</CardTitle>
				<CardDescription>
					Enter your phone number and password below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={phoneInputId}>Phone</FieldLabel>
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
							<div className="flex items-center">
								<FieldLabel htmlFor={passwordInputId} className="gap-1">
									Password
								</FieldLabel>
							</div>
							<Input id={passwordInputId} type="password" required />
						</Field>

						{/* // TODO: add forgot password link */}
						<Link
							to="/forgot-password"
							className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</Link>

						<Field>
							<Button type="submit">Login</Button>
							<FieldDescription className="text-center">
								Don&apos;t have an account? <Link to="/signup">Sign up</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
