import {
	BookOpenIcon,
	BotIcon,
	CreditCardIcon,
	TerminalIcon,
	TerminalSquareIcon,
} from 'lucide-react';
import { type ComponentProps, useState } from 'react';

import { NavMain } from '@/components/sidebar/nav-main';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarSeparator,
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
	navSecondary: [
		// {
		// 	title: 'Support',
		// 	url: '#',
		// 	icon: <LifeBuoyIcon />,
		// },
		// {
		// 	title: 'Feedback',
		// 	url: '#',
		// 	icon: <SendIcon />,
		// },
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
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>

			<SidebarFooter className="border-t">
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
