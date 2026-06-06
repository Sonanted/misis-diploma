import { type SubmitEvent, useId } from 'react';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function CodeStep({
	code,
	setCode,
	onSubmit,
}: {
	code: string;
	setCode: (v: string) => void;
	onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}) {
	const codeInputId = useId();
	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={codeInputId}>
						Code <span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						id={codeInputId}
						type="text"
						placeholder="Enter the code you received"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<Button type="submit">Verify Code</Button>
					<FieldDescription className="px-6 text-center">
						Remembered your password? <Link to="/login">Sign in</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
