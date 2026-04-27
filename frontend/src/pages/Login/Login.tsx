import { type ComponentProps, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { cn } from '@/lib/utils';

export default function Login({ className, ...props }: ComponentProps<'div'>) {
	const [phoneNumber, setPhoneNumber] = useState('');

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Login to your account</CardTitle>
					<CardDescription>Enter your email below to login to your account</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="phone">Phone</FieldLabel>
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
								<div className="flex items-center">
									<FieldLabel htmlFor="password" className="gap-1">
										Password
									</FieldLabel>
								</div>
								<Input id="password" type="password" required />
							</Field>

							{/* // TODO: add forgot password link */}
							<a
								href="#"
								className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
							>
								Forgot your password?
							</a>

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
		</div>
	);
}
