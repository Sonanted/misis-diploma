import {
	BookOpenIcon,
	BotIcon,
	CreditCardIcon,
	TerminalIcon,
	TerminalSquareIcon,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useMe } from '@/entities/user/queries';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from '@/shared/ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	const { t } = useTranslation();
	const { data: me } = useMe();

	const navItems = [
		{ title: t('sidebar.dashboard'), url: '/', icon: <TerminalSquareIcon /> },
		{ title: t('sidebar.cards'), url: '/cards', icon: <CreditCardIcon /> },
		{ title: t('sidebar.operations'), url: '/operations', icon: <BotIcon /> },
		{ title: t('sidebar.payments'), url: '/payments', icon: <BookOpenIcon /> },
	];

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
								<span className="truncate font-medium text-lg">{t('sidebar.app_name')}</span>
							</div>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={navItems} activeUrl="/" onItemClick={() => {}} />
			</SidebarContent>

			<SidebarFooter className="border-t">
				<NavUser user={me} />
			</SidebarFooter>
		</Sidebar>
	);
}
