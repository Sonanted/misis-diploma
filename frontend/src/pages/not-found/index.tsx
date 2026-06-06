import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

interface NotFoundProps {
	title?: string;
	description?: string;
	backTo?: string;
	backLabel?: string;
}

export function NotFound({
	title = 'Not Found',
	description = "The item you're looking for doesn't exist or has been removed.",
	backTo = '/accounts',
	backLabel = 'Go to Accounts',
}: NotFoundProps) {
	return (
		<div className="flex items-center justify-center h-full p-8">
			<Card className="max-w-md w-full">
				<CardContent className="pt-6">
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="p-3 bg-destructive/10 rounded-full">
							<AlertCircle className="size-8 text-destructive" />
						</div>
						<div className="space-y-2">
							<h1 className="text-2xl font-semibold">{title}</h1>
							<p className="text-muted-foreground">{description}</p>
						</div>
						<Link to={backTo} className="w-full">
							<Button className="w-full">
								<ArrowLeft className="size-4 mr-2" />
								{backLabel}
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
