import { Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PhoneInput } from '../ui/phone-input';
import { Separator } from '../ui/separator';

export function Settings() {
	const [personalInfo, setPersonalInfo] = useState({
		firstName: 'John',
		middleName: 'Alexander',
		lastName: 'Doe',
		email: 'john.doe@email.com',
		phone: '+79997732136',
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handlePersonalInfoSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!personalInfo.firstName ||
			!personalInfo.lastName ||
			!personalInfo.email ||
			!personalInfo.phone
		) {
			toast.error('Please fill in all required fields');
			return;
		}

		toast.success('Personal information updated successfully!');
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
			toast.error('Please fill in all password fields');
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error('New passwords do not match');
			return;
		}

		if (passwordData.newPassword.length < 8) {
			toast.error('Password must be at least 8 characters long');
			return;
		}

		toast.success('Password updated successfully!');
		setPasswordData({
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		});
	};

	return (
		<div className="flex flex-col h-full overflow-y-auto">
			<div className="p-8">
				<div className="max-w-2xl mx-auto space-y-6">
					<div>
						<h1 className="text-3xl font-semibold mb-2">Settings</h1>
						<p className="text-muted-foreground">Manage your account settings and preferences</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
							<CardDescription>Update your personal details</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name *</Label>
									<Input
										id="firstName"
										value={personalInfo.firstName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name *</Label>
									<Input
										id="lastName"
										value={personalInfo.lastName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="middleName">Middle Name</Label>
									<Input
										id="middleName"
										value={personalInfo.middleName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, middleName: e.target.value })}
									/>
								</div>

								<Separator />

								<div className="space-y-2">
									<Label htmlFor="email">Email *</Label>
									<Input
										id="email"
										type="email"
										value={personalInfo.email}
										onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number *</Label>
									<PhoneInput
										id="phone"
										value={personalInfo.phone}
										onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target?.value ?? '' })}
										international
										placeholder="Enter a phone number"
										required
									/>
								</div>

								<div className="pt-4">
									<Button type="submit" className="w-full">
										<Save className="size-4 mr-2" />
										Save Changes
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>Update your password to keep your account secure</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePasswordSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="currentPassword">Current Password *</Label>
									<Input
										id="currentPassword"
										type="password"
										value={passwordData.currentPassword}
										onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password *</Label>
									<Input
										id="newPassword"
										type="password"
										value={passwordData.newPassword}
										onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
									/>
									<p className="text-xs text-muted-foreground">
										Password must be at least 8 characters long
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password *</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={passwordData.confirmPassword}
										onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
									/>
								</div>

								<div className="pt-4">
									<Button type="submit" className="w-full">
										<Save className="size-4 mr-2" />
										Update Password
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
