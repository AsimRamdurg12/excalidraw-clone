import { PiPen, PiPenNib } from "react-icons/pi";
import Button from "../../ui/Button";
import { BsArrowRight } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FiZap } from "react-icons/fi";
import useProfile from "../../hooks/useProfile";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { user } = useProfile();
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200">
      <div className="pt-20 pb-20 text-center">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-600">
              <PiPenNib size={30} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold">DrawBoard</h3>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl leading-tight font-bold">
            Think{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Visually
            </span>
            <br />
            Create Limitlessly
          </h1>

          <p className="mt-4 pb-6 text-gray-900 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into reality with an infinite digital
            whiteboard. Collaborate, brainstorm, and visualize concepts with the
            freedom of unlimited space.
          </p>

          <Button
            onClick={() =>
              user ? navigate("/dashboard") : navigate("/user/authenticate")
            }
            className="group flex items-center gap-2 text-xl px-8 py-4 rounded-xl transition-all transform duration-300 hover:scale-105 hover:shadow-xl font-semibold shadow-md"
          >
            Start Creating for Free
            <BsArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-2xl">
          <div className="flex justify-center items-center gap-3 font-medium text-gray-600">
            <FaUsers className="size-5 text-blue-600" />
            Real time Collaboration
          </div>
          <div className="flex justify-center items-center gap-3 font-medium text-gray-600">
            <FiZap className="size-5 text-purple-500" />
            Instant Sync
          </div>
          <div className="flex justify-center items-center gap-3 font-medium text-gray-600">
            <PiPen className="size-5 text-green-500" />
            Infinite Canvas
          </div>
        </div>

        <div className="mt-6 sm:mt-16 mx-auto relative max-w-5xl p-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-red-500 size-3"></div>
                <div className="rounded-full bg-yellow-500 size-3"></div>
                <div className="rounded-full bg-green-500 size-3"></div>
                <span className="ml-4 font-medium text-gray-600">
                  DrawingBoard - WhiteBoard
                </span>
              </div>
            </div>
            <div className="aspect-video relative p-8">
              <div className="absolute top-8 bg-yellow-50 left-8 sm:h-20 sm:w-32 h-10 w-16 rounded border-2 border-yellow-200"></div>
              <div className="absolute top-16 bg-purple-50 right-12 sm:size-24 size-16 rounded-full border-2 border-purple-200"></div>
              <div className="absolute bottom-12 bg-blue-50 left-16 sm:w-40 sm:h-12 w-20 h-8 rounded border-2 border-blue-200"></div>
              <div className="absolute bottom-8 bg-green-50 right-8 w-28 h-16 rounded border-2 border-green-200"></div>
              <svg className="absolute inset-0 w-full h-full opacity-60">
                <line
                  x1="20%"
                  y1="30%"
                  x2="70%"
                  y2="45%"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="30%"
                  y1="70%"
                  x2="60%"
                  y2="35%"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
