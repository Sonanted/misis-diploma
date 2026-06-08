import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
	return (
		<div className="flex justify-center py-20">
			<div className="flex flex-col items-center text-center space-y-4 max-w-xs">
				<div className="p-4 bg-muted rounded-full">
					<Icon className="size-8 text-muted-foreground" />
				</div>
				<div className="space-y-1">
					<h2 className="text-lg font-semibold">{title}</h2>
					{description && <p className="text-sm text-muted-foreground">{description}</p>}
				</div>
				{action}
			</div>
		</div>
	);
}
