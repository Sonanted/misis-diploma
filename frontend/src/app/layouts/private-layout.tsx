import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { useBankInfo } from '@/entities/account/queries';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar';
import { AppSidebar } from '@/widgets/sidebar/app-sidebar';
import SidebarInsetHeader from '@/widgets/sidebar/sidebar-inset-header';

export default function PrivateLayout() {
	useBankInfo();
	return (
		<SidebarProvider>
			<div className="flex w-full h-screen  bg-background text-foreground">
				<AppSidebar />
				<SidebarInset>
					<SidebarInsetHeader />
					<ScrollArea className="flex-1 overflow-y-auto">
						<div className="max-w-5xl mx-auto p-6">
							<Suspense
								fallback={<Loader2 className="mx-auto mt-16 h-6 w-6 animate-spin text-muted-foreground" />}
							>
								<Outlet />
							</Suspense>
						</div>
					</ScrollArea>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
