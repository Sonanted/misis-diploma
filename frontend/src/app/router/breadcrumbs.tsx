import { useAccount } from '@/entities/account/queries';

export function AccountBreadcrumb({ id }: { id?: string }) {
	const { data } = useAccount(id ?? '');
	return <>{data?.name ?? id}</>;
}
