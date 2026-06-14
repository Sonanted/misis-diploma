import { useAccount } from '@/entities/account/queries';
import { useCard } from '@/entities/card/queries';

export function AccountBreadcrumb({ id }: { id?: string }) {
	const { data } = useAccount(id ?? '');
	return <>{data?.name ?? id}</>;
}

export function CardBreadcrumb({ id }: { id?: string }) {
	const { data } = useCard(id ?? '');
	return <>{data?.name ?? id}</>;
}
