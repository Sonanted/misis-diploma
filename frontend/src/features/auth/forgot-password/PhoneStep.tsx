import { type SubmitEvent, useId } from 'react';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { PhoneInput } from '@/shared/ui/phone-input';

export function PhoneStep({
	phone,
	setPhone,
	onSubmit,
}: {
	phone: string;
	setPhone: (v: string) => void;
	onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}) {
	const phoneInputId = useId();
	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={phoneInputId}>
						Phone <span className="text-destructive">*</span>
					</FieldLabel>
					<PhoneInput
						id={phoneInputId}
						value={phone}
						onChange={setPhone}
						international
						defaultCountry="RU"
						placeholder="Enter your phone number"
						required
					/>
				</Field>
				<Field>
					<Button type="submit">Send Code</Button>
					<FieldDescription className="px-6 text-center">
						Remembered your password? <Link to="/login">Sign in</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
