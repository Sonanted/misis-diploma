import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: ReactNode;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
	activeUrl: string;
	onItemClick: (url: string) => void;
}) {
	return (
		<SidebarGroup>
			<SidebarMenu className="flex gap-y-1">
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<NavLink to={item.url}>
							{({ isActive }) => (
								<SidebarMenuButton isActive={isActive} size="lg" className="text-lg">
									{item.icon}
									<span>{item.title}</span>
								</SidebarMenuButton>
							)}
						</NavLink>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
