import { benefits, benefits2 } from "../../lib/constants";

const Benefits = () => {
  return (
    <section className="min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Built for{" "}
            <span className="bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Teams
            </span>
          </h2>
          <p className="mt-4 pb-6 max-w-2xl text-xl leading-relaxed px-2 sm:px-0">
            Experience the reliability, security, and performance that today's
            distributed teams demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const IconComponent = benefit.icon;
            return (
              <div className="p-4 text-center rounded group space-y-2">
                <div className="relative mb-6 space-y-2">
                  <div className="flex justify-center transform transition-all duration-300 hover:scale-110 items-center mx-auto size-20 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                    <IconComponent className="size-10 text-white" />
                  </div>
                  <div className="sm:absolute -top-2 -right-2 text-xs px-2 py-1 bg-green-500 rounded-full text-white font-semibold">
                    {benefit.stats}
                  </div>
                </div>
                <h3 className="text-xl font-medium leading-relaxed">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border text-center border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-8 md:p-16 rounded-2xl">
          <div className="space-y-4">
            <h3 className="text-3xl text-gray-900 font-bold">
              Trusted by Thousands of teams worldwide
            </h3>
            <p className="max-w-3xl mx-auto text-gray-700">
              From startups to Fortune 500 companies, teams choose DrawBoard for
              its simplicity, power, and reliability in visual collaboration.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
            {benefits2.map((b, i) => (
              <div className="text-center" key={i}>
                <h2 className="text-3xl text-gray-600 font-bold">{b.title}</h2>
                <p className="text-gray-500">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
