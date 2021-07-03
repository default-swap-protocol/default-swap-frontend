import dynamic from "next/dynamic";
const DashboardTable = dynamic(() => import("@components/DashboardTable"), { ssr: false });

const Dashboard = () => {
  return (
    <div>
      <DashboardTable />
    </div>
  );
};

export default Dashboard;
