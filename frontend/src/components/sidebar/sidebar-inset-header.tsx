import { Fragment } from 'react/jsx-runtime';
import { Link, useMatches } from 'react-router';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';

type BreadcrumbHandle =
	| string
	| ((match: { params: Record<string, string | undefined>; data: unknown }) => string);

export default function SidebarInsetHeader() {
	const matches = useMatches();

	const breadcrumbs = matches
		.filter((match) => (match.handle as { breadcrumb?: BreadcrumbHandle })?.breadcrumb)
		.map((match) => {
			const breadcrumb = (match.handle as { breadcrumb?: BreadcrumbHandle })?.breadcrumb;

			return {
				pathname: match.pathname,
				label:
					typeof breadcrumb === 'function'
						? breadcrumb({
								params: match.params,
								data: match.data,
							})
						: breadcrumb,
			};
		});

	return (
		<header className="flex h-16 shrink-0 items-center border-b">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />

				<Separator orientation="vertical" className="mr-2 h-8" />

				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((crumb, index) => {
							const isLast = index === breadcrumbs.length - 1;

							return isLast ? (
								<BreadcrumbItem key={crumb.pathname}>
									<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
								</BreadcrumbItem>
							) : (
								<Fragment key={crumb.pathname}>
									<BreadcrumbItem key={crumb.pathname}>
										<BreadcrumbLink render={<Link to={crumb.pathname}>{crumb.label}</Link>} />
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
								</Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
