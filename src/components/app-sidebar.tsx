import { type ComponentProps, useState } from 'react';

import {
	BookOpenIcon,
	BotIcon,
	LifeBuoyIcon,
	SendIcon,
	TerminalIcon,
	TerminalSquareIcon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Dashboard',
			url: '/',
			icon: <TerminalSquareIcon />,
		},
		{
			title: 'Operations',
			url: '/operations',
			icon: <BotIcon />,
		},
		{
			title: 'Payments',
			url: '/payments',
			icon: <BookOpenIcon />,
		},
	],
	navSecondary: [
		{
			title: 'Support',
			url: '#',
			icon: <LifeBuoyIcon />,
		},
		{
			title: 'Feedback',
			url: '#',
			icon: <SendIcon />,
		},
	],
};
export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const [activeUrl, setActiveUrl] = useState('/');

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex w-full items-center gap-2 overflow-hidden p-2 text-left [&_svg]:shrink-0 [&>span:last-child]:truncate h-12 text-sm">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<TerminalIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">Bank</span>
								<span className="truncate text-xs">Bank</span>
							</div>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navMain} activeUrl={activeUrl} onItemClick={setActiveUrl} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
