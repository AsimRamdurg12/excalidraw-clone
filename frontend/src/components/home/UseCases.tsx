import { useCases } from "../../lib/constants";
import Button from "../../ui/Button";

const UseCases = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Unlimited{" "}
            <span className="bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Possibilities
            </span>
          </h3>
          <p className="mt-5 text-xl text-gray-700">
            From quick sketches to complex diagrams, discover how visual
            thinking transforms the way you work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-5 gap-8">
          {useCases.map((usecase, index) => {
            const IconComponent = usecase.icon;
            return (
              <div
                key={index}
                className="group border border-gray-200 p-4 rounded-xl space-y-2 bg-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  className={`bg-gradient-to-br ${usecase.color} size-12 flex justify-center items-center rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="size-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold leading-relaxed">
                  {usecase.title}
                </h3>
                <p className="text-gray-700">{usecase.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-center space-y-4">
          <p className="text-xl text-gray-700">
            Ready to explore what's possible with visual thinking?
          </p>
          <Button className="rounded-lg text-lg bg-gradient-to-br px-8 py-4 from-blue-600 to-purple-600 transform transition-all duration-300 hover:scale-105">
            Start Your First Board
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
