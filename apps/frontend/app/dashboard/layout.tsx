import DashboardNav from "@/components/custom/dashboardNav";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div>
			<DashboardNav />
			{children}
		</div>
	);
}
