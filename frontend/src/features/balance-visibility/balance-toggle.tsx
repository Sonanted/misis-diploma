import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';

type Props = {
	visible: boolean;
	onToggle: () => void;
};

export function BalanceToggle({ visible, onToggle }: Props) {
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={onToggle}
			aria-label={visible ? 'Скрыть суммы' : 'Показать суммы'}
		>
			{visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
		</Button>
	);
}
