import { Outlet } from 'react-router';

import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import SidebarInsetHeader from '../sidebar/sidebar-inset-header';
import { ScrollArea } from '../ui/scroll-area';

export default function PrivateLayout() {
	return (
		<SidebarProvider>
			<div className="flex w-full h-screen  bg-background text-foreground">
				<AppSidebar />
				<SidebarInset>
					<SidebarInsetHeader />
					<ScrollArea className="flex-1 overflow-y-auto">
						<div className="max-w-5xl mx-auto p-6">
							<Outlet />
						</div>
					</ScrollArea>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
