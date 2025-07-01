import Room from "./Room";

const Dashboard = () => {
  return (
    <section className=" overflow-hidden max-w-7xl mx-auto min-h-screen">
      {/* <Navbar /> */}

      <div className="relative flex">
        <aside className="max-md:hidden min-h-screen border-r w-60">
          <div className="fixed">Asim</div>
        </aside>
        <Room />
      </div>
    </section>
  );
};

export default Dashboard;
