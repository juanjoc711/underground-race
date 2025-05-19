export default function DocumentaryPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Documental: UnderGroundRace</h1>

      {/* Video embebido de YouTube */}
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          src="https://www.youtube.com/embed/NFXVYlynJbs"
          title="Documental: LUnderGroundRace"
          allowFullScreen
          className="w-full h-full rounded"
          frameBorder="0"
        ></iframe>
      </div>

      <section className="mb-8 text-gray-700">
        <p>
          Sumérgete en la adrenalina y la velocidad con este emocionante documental que explora el mundo de las carreras de coches. Conoce a los pilotos, los desafíos técnicos y las historias detrás de cada vuelta en la pista. Una experiencia imperdible para los amantes del motor y la competición.
        </p>
      </section>

      <a
        href="/"
        className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
      >
        ← Volver al inicio
      </a>
    </main>
  );
}
