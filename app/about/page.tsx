export const metadata = {
  title: "About the Crew",
  description: "Meet the Sailpony crew.",
};

export default function AboutPage() {
  const crew = [
    {
      name: "Clay",
      role: "Captain",
      blurb:
        "Clay is the mastermind behind this trip. He has a story for everything.",
      image: "/photos/clay.jpg",
    },
    {
      name: "Bailey",
      role: "Crew",
      blurb:
        "Bailey is on her way to getting a USCG captain's license!",
      image: "/photos/bailey.jpg",
    },
    {
      name: "Tanner",
      role: "Crew",
      blurb:
        "Tanner is taking a break from his job as a schooner deckhand. He also made this website!",
      image: "/photos/tanner.jpg",
    },
  ];

    return (
         <main className="min-h-screen text-gray-100 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Meet the Crew</h1>

        <div className="flex flex-col gap-12">
          {crew.map((person) => (
            <div
              key={person.name}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-6"
            >
              <img
                src={person.image}
                alt={person.name}
                className="w-28 h-28 rounded-full object-cover flex-shrink-0"
              />

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold">{person.name}</h2>
                <p className="mb-2 text-sm tracking-wide">
                  {person.role}
                </p>
                <p className="text-gray-400 max-w-prose">{person.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
