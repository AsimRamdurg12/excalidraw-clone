import { BsArrowRight, BsPlayBtn } from "react-icons/bs";
import Button from "../../ui/Button";

const CalltoAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-6 leading-tight">
            Ready to Transform <br />
            Your Visual Thinking?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 leading-relaxed">
            Join thousands of teams who've discovered the power of unlimited
            creative collaboration. Start creating your first board in seconds.
          </p>
        </div>

        <div className="flex items-center max-sm:flex-col justify-center my-5 gap-2 w-full">
          <Button className="group bg-white text-blue-600 flex items-center justify-center gap-2 font-bold text-xl py-4 px-8 transform transition-all duration-300 hover:scale-105 hover:gap-4">
            {" "}
            Start Creating Now - It's Free
            <BsArrowRight />
          </Button>
          <Button className="group flex justify-center px-8 py-4 items-center gap-2 bg-transparent border transform transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:gap-4">
            Watch Demo Video
            <BsPlayBtn className="size-6" />
          </Button>
        </div>

        <p className="text-center leading-relaxed text-white">
          ✓ No credit card required ✓ Unlimited boards ✓ Real-time collaboration
          Get started in under 30 seconds
        </p>
      </div>
    </section>
  );
};

export default CalltoAction;
