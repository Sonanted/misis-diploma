import { useMatches } from 'react-router';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

export default function SidebarInsetHeader() {
	const matches = useMatches();

	const breadcrumbs = matches
		.map((m) => (m.handle as { breadcrumb?: string } | undefined)?.breadcrumb)
		.filter(Boolean);

	return (
		<header className="flex h-16 shrink-0 items-center border-b">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2" />
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((crumb, index) => {
							const isLast = index === breadcrumbs.length - 1;
							const url = `/${breadcrumbs
								.map((b) => (b === 'Dashboard' ? '' : b))
								.slice(0, index + 1)
								.join('/')}`;

							return (
								<BreadcrumbItem key={url}>
									{isLast ? (
										<BreadcrumbPage>{crumb}</BreadcrumbPage>
									) : (
										<>
											<BreadcrumbLink href={url}>{crumb}</BreadcrumbLink>
											<BreadcrumbSeparator className="hidden md:block" />
										</>
									)}
								</BreadcrumbItem>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
