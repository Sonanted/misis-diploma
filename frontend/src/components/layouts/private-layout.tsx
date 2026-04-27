import { Outlet } from 'react-router';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import SidebarInsetHeader from '../sidebar-inset-header';
import { ScrollArea } from '../ui/scroll-area';

export default function PrivateLayout() {
	return (
		<SidebarProvider>
			<div className="flex w-full h-screen p-2 bg-background text-foreground">
				<AppSidebar />
				<SidebarInset className="overflow-y-hidden">
					<SidebarInsetHeader />
					<ScrollArea className="overflow-y-auto">
						<div className="max-w-5xl mx-auto p-6">
							<Outlet />
						</div>
					</ScrollArea>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
