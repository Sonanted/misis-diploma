import { useAccount } from '@/entities/account/queries';
import { useCard } from '@/entities/card/queries';
import { useOperation } from '@/entities/operation/queries';

export function AccountBreadcrumb({ id }: { id?: string }) {
	const { data } = useAccount(id ?? '');
	return <>{data?.name ?? id}</>;
}

export function CardBreadcrumb({ id }: { id?: string }) {
	const { data } = useCard(id ?? '');
	return <>{data?.name ?? id}</>;
}

export function OperationBreadcrumb({ id }: { id?: string }) {
	const { data } = useOperation(id ?? '');
	return <>{data?.description ?? id}</>;
}