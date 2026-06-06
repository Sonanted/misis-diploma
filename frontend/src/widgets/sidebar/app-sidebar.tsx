import {
	BookOpenIcon,
	BotIcon,
	CreditCardIcon,
	TerminalIcon,
	TerminalSquareIcon,
} from 'lucide-react';
import { type ComponentProps, useState } from 'react';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from '@/shared/ui/sidebar';

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
			title: 'Cards',
			url: '/cards',
			icon: <CreditCardIcon />,
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
};
export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const [activeUrl, setActiveUrl] = useState('/');

	return (
		<Sidebar variant="sidebar" {...props}>
			<SidebarHeader className="border-b max-h-16">
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="flex w-full items-center gap-2 overflow-hidden p-2 text-left [&_svg]:shrink-0 [&>span:last-child]:truncate h-12">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<TerminalIcon className="size-4" />
							</div>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium text-lg">Yet Another Bank</span>
							</div>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navMain} activeUrl={activeUrl} onItemClick={setActiveUrl} />
			</SidebarContent>

			<SidebarFooter className="border-t">
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
