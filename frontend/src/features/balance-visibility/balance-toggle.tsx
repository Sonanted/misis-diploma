import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';

type Props = {
	visible: boolean;
	onToggle: () => void;
};

export function BalanceToggle({ visible, onToggle }: Props) {
	const { t } = useTranslation();
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={onToggle}
			aria-label={visible ? t('balance_toggle.hide') : t('balance_toggle.show')}
		>
			{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
		</Button>
	);
}
