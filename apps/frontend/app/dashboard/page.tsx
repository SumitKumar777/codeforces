import GetProblem from "@/components/custom/problemList";
import UserData from "@/components/custom/userData";

function Dashboard() {
	return (
		<div>
			<h1>Dashboard Page</h1>
			<UserData />
			<GetProblem />
		</div>
	);
}

export default Dashboard;
