import { type ComponentProps, useId, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PhoneInput } from '@/shared/ui/phone-input';

export default function Login({ ...props }: ComponentProps<'div'>) {
	const [phoneNumber, setPhoneNumber] = useState('');

	const phoneInputId = useId();
	const passwordInputId = useId();

	return (
		<Card {...props}>
			<CardHeader>
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
						<Field>
							<Button type="submit">Login</Button>

							<FieldDescription className="text-center">
								<Link to="/forgot-password">Forgot your password?</Link>
							</FieldDescription>
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
