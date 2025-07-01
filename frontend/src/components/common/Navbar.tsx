import { PiPenNib } from "react-icons/pi";
import Button from "../../ui/Button";
import { IoMenu } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className="fixed min-w-screen bg-white z-1 border-b">
      <div className="flex justify-between items-center px-6 py-2">
        <div className="p-1 rounded-lg bg-blue-600">
          <PiPenNib size={30} className="text-white" />
        </div>
        <div></div>
        <div className="flex gap-2 items-center">
          <Button className="flex md:hidden p-0 bg-transparent text-black">
            <IoMenu size={20} />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
