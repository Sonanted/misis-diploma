import { Outlet } from 'react-router';

import { AppSidebar } from '@/widgets/sidebar/app-sidebar';
import SidebarInsetHeader from '@/widgets/sidebar/sidebar-inset-header';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';

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
