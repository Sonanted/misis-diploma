import { Link } from 'react-router';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar';

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" render={<Link to="/profile" />} className="border-0">
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user.name}</span>
						<span className="truncate text-xs">{user.email}</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
