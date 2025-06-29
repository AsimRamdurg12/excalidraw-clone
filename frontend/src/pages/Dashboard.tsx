import Navbar from "../components/common/Navbar";
import Room from "./Room";

const Dashboard = () => {
  return (
    <section className="relative overflow-hidden min-h-screen">
      <Navbar />
      <div className="relative">
        <div className="flex pt-16 relative">
          <aside className="max-md:hidden fixed min-h-screen border-r w-60">
            Asim
          </aside>
          <div className="max-w-7xl mx-auto md:pl-64">
            <h2 className="text-5xl">Rooms</h2>
            <div>
              <Room />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
