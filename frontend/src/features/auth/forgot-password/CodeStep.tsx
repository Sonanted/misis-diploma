import { type SubmitEvent, useId } from 'react';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation();
	const codeInputId = useId();
	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={codeInputId}>
						{t('auth.forgot_password.code')} <span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						id={codeInputId}
						type="text"
						placeholder={t('auth.forgot_password.code_placeholder')}
						value={code}
						onChange={(e) => setCode(e.target.value)}
						required
					/>
				</Field>
				<Field>
					<Button type="submit">{t('auth.forgot_password.verify_code')}</Button>
					<FieldDescription className="px-6 text-center">
						{t('auth.forgot_password.remembered')} <Link to="/login">{t('auth.forgot_password.sign_in')}</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
