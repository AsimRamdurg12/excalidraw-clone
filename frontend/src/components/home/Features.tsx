import { features } from "../../lib/constants";

const Features = () => {
  return (
    <section className="relative min-h-screen bg-white">
      <div className="pt-20 pb-20 text-center">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create
            </span>
          </h2>
          <p className="mt-4 pb-6 text-xl max-w-2xl">
            Powerful tools designed for modern teams who think visually and work
            collaboratively.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl gap-3 mx-auto p-4">
          {features.map((feature, index) => (
            <div
              className="group p-4 border border-gray-200 rounded-xl space-y-3 text-left transform transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-blue-200"
              key={index}
            >
              <div className="flex justify-center items-center rounded-xl size-12 bg-gradient-to-br from-blue-600 to-purple-600 group-hover:scale-110 transition-transform">
                {<feature.icon className="size-6 text-white" />}
              </div>
              <h3 className="text-xl font-semibold leading-relaxed">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
