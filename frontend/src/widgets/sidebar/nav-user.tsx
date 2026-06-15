import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useLogout } from '@/entities/user/queries';
import type { ApiUser } from '@/shared/api/types';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar';

export function NavUser({ user }: { user: ApiUser | undefined }) {
	const { t } = useTranslation();
	const logout = useLogout();

	const fullName = user
		? [user.lastName, user.firstName, user.middleName].filter(Boolean).join(' ')
		: '…';

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" render={<Link to="/settings" />} className="border-0">
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{fullName}</span>
						<span className="truncate text-xs text-muted-foreground">
							{t('sidebar.open_settings')}
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={() => logout.mutate()}
					disabled={logout.isPending}
					className="border-0 text-destructive hover:text-destructive"
				>
					<LogOut className="size-4" />
					<span>{t('sidebar.logout')}</span>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
