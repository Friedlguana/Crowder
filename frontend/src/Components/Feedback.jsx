import React from "react";

const data = [
  {
    name: "Kanye West",
    role: "Rapper & Entrepreneur",
    img: "https://pbs.twimg.com/profile_images/1276461929934942210/cqNhNk6v_400x400.jpg",
    quote: "Find God.",
    link: "https://twitter.com/kanyewest",
  },
  {
    name: "Tim Cook",
    role: "CEO of Apple",
    img: "https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_400x400.jpg",
    quote:
      "Diam quis enim lobortis scelerisque fermentum dui faucibus in ornare. Donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum.",
    link: "https://twitter.com/tim_cook",
  },
  {
    name: "Satya Nadella",
    role: "CEO of Microsoft",
    img: "https://pbs.twimg.com/profile_images/1221837516816306177/_Ld4un5A_400x400.jpg",
    quote:
      "Tortor dignissim convallis aenean et tortor at. At ultrices mi tempus imperdiet nulla malesuada.",
    link: "https://twitter.com/satyanadella",
  },
  // ...rest of your repeated data
];

const CustomersTestimoniesGrid = ({ onClose , response }) => {
  return (<>
    {response.length > 0 ? <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose} // clicking background closes popup
      />

      {/* Popup Content */}
      <div className="relative z-50 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-12 space-y-5 md:mb-16 md:text-center">
          <div className="inline-block px-3 py-1 text-sm font-semibold text-green-400 rounded-lg border border-green-600/40 bg-neutral-900">
            Words from Others
          </div>
          <h1 className="mb-5 text-3xl font-semibold text-white md:text-5xl">
            It's not just us.
          </h1>
          <p className="text-lg text-neutral-400 md:text-xl">
            Here's what others have to say about us.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {response.map((person, i) => (
            <a
              key={i}
              href={"person.link"}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-lg hover:shadow-green-500/20 transition duration-300"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={person.img}
                  className="w-12 h-12 rounded-full border border-neutral-700"
                  alt={person.name}
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {person.name}
                  </h3>
                  <p className="text-sm text-neutral-400">{"person.role"}</p>
                </div>
              </div>
              <p className="mt-4 text-neutral-500/80 text-sm leading-relaxed">
                {person.quote}
              </p>
            </a>
          ))}
        </div>

        {/* Close Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>:<>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose} // clicking background closes popup
      />

      {/* Popup Content */}
      <div className="relative z-50 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-12 space-y-5 md:mb-16 md:text-center">
          <div className="inline-block px-3 py-1 text-sm font-semibold text-green-400 rounded-lg border border-green-600/40 bg-neutral-900">
            Words from Others
          </div>
          <h1 className="mb-5 text-md font-semibold text-white md:text-5xl">
            It's not just us.
          </h1>
          <p className="text-sm text-neutral-400 md:text-xl">
            Here's what others have to say about us.
          </p>
        </div>

        <p className="mt-4 text-neutral-500/80 text-sm leading-relaxed text-center">No Responses Yet</p>

        {/* Close Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>}</>
  );
};

export default CustomersTestimoniesGrid;
