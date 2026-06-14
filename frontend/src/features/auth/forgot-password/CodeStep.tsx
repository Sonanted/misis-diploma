import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/ui/input-otp';

type CodeFormValues = { code: string };

export function CodeStep({
	onSubmit,
	loading,
}: {
	onSubmit: (data: CodeFormValues) => void;
	loading?: boolean;
}) {
	const { t } = useTranslation();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<CodeFormValues>({ mode: 'onBlur' });

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field data-invalid={!!errors.code}>
					<FieldLabel>
						{t('auth.forgot_password.code')} <span className="text-destructive">*</span>
					</FieldLabel>
					<Controller
						name="code"
						control={control}
						rules={{
							required: t('validation.required'),
							minLength: { value: 6, message: t('validation.required') },
						}}
						render={({ field }) => (
							<InputOTP
								maxLength={6}
								value={field.value ?? ''}
								onChange={field.onChange}
								onBlur={field.onBlur}
								onComplete={handleSubmit(onSubmit)}
								autoFocus
								containerClassName="justify-center"
							>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
								</InputOTPGroup>
								<InputOTPSeparator />
								<InputOTPGroup>
									<InputOTPSlot index={3} />
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
							</InputOTP>
						)}
					/>
					<FieldError errors={[errors.code]} />
				</Field>
				<Field>
					<Button type="submit" disabled={loading}>
						{loading ? t('common.loading') : t('auth.forgot_password.verify_code')}
					</Button>
					<FieldDescription className="px-6 text-center">
						{t('auth.forgot_password.remembered')}{' '}
						<Link to="/login">{t('auth.forgot_password.sign_in')}</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
