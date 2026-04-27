import type { ReactNode } from 'react';

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router';

export function NavMain({
	items,
	activeUrl,
	onItemClick,
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
			<SidebarMenu className='flex gap-y-1'>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<SidebarMenuButton
							isActive={item.url === activeUrl}
							render={<Link to={item.url} />}
							onClick={() => onItemClick(item.url)}
							size="lg"
							className="text-lg"
						>
							{item.icon}
							<span>{item.title}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
