import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { cloneElement, isValidElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useCardPin, useChangeCardPin } from '@/entities/card/queries';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { Separator } from '@/shared/ui/separator';

interface PinDialogProps {
	cardId: string;
	trigger: React.ReactNode;
}

export function PinDialog({ cardId, trigger }: PinDialogProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [pinVisible, setPinVisible] = useState(false);
	const [newPin, setNewPin] = useState('');
	const changePin = useChangeCardPin();

	const { data: pinData, isFetching: isPinLoading } = useCardPin(cardId, open);

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (!next) {
			setPinVisible(false);
			setNewPin('');
		}
	};

	const handleSave = () => {
		changePin.mutate(
			{ id: cardId, dto: { pin: newPin } },
			{
				onSuccess: () => {
					toast.success(t('cards.pin_success'));
					handleOpenChange(false);
				},
				onError: () => {
					toast.error(t('cards.action_error'));
				},
			},
		);
	};

	return (
		<>
			{isValidElement(trigger)
				? cloneElement(trigger as React.ReactElement<{ onClick: () => void }>, {
						onClick: () => setOpen(true),
					})
				: trigger}
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent>
					<span autoFocus tabIndex={-1} className="sr-only" />
					<DialogHeader>
						<DialogTitle>{t('cards.pin_dialog_title')}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 pt-2">
						<div className="flex flex-col items-center gap-3">
							<p className="text-sm text-muted-foreground">{t('cards.pin_current_label')}</p>
							<div className="flex items-center gap-3">
								{isPinLoading ? (
									<Loader2 className="size-5 animate-spin text-muted-foreground" />
								) : (
									<>
										<p className="font-mono text-2xl tracking-[0.5em]">
											{pinVisible ? (pinData?.pin ?? '••••') : '••••'}
										</p>
										<button
											type="button"
											onClick={() => setPinVisible((v) => !v)}
											className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
											aria-label={pinVisible ? t('cards.pin_hide') : t('cards.pin_show')}
										>
											{pinVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
										</button>
									</>
								)}
							</div>
						</div>

						<Separator />

						<div className="flex flex-col items-center gap-3">
							<p className="text-sm text-muted-foreground">{t('cards.pin_change_label')}</p>
							<InputOTP
								maxLength={4}
								value={newPin}
								onChange={setNewPin}
								inputMode="numeric"
								pattern="[0-9]*"
							>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
									<InputOTPSlot index={3} />
								</InputOTPGroup>
							</InputOTP>
						</div>

						<div className="flex gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={() => handleOpenChange(false)}
							>
								{t('common.cancel')}
							</Button>
							<Button
								type="button"
								className="flex-1"
								disabled={newPin.length < 4 || changePin.isPending}
								onClick={handleSave}
							>
								{t('cards.pin_submit')}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
