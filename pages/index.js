import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchMovies = async () => {
      const snap = await getDocs(collection(db, "movies"));
      setMovies(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredMovie = movies[Math.floor(Math.random() * movies.length)];

  if (loading || !user) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 px-6 py-4 bg-black bg-opacity-80 backdrop-blur sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold text-red-600">SujanFlix</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-auto px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => auth.signOut()}
            className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* HERO BANNER */}
      {featuredMovie && (
        <div
          className="relative h-[40vh] sm:h-[60vh] bg-cover bg-center flex items-end p-4 sm:p-6"
          style={{
            backgroundImage: `url('${
              featuredMovie.banner ||
              "https://source.unsplash.com/1600x900/?movie"
            }')`,
          }}
        >
          <div className="bg-black bg-opacity-60 p-4 sm:p-6 rounded max-w-full sm:max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {featuredMovie.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4 line-clamp-3">
              {featuredMovie.description}
            </p>
            <Link href={`/movie/${featuredMovie.id}`}>
              <button className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200">
                ▶ Play
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* MOVIE ROW */}
      <section className="px-6 py-8">
        <h3 className="text-2xl font-semibold mb-4">All Movies</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[240px] bg-zinc-900 rounded-lg shadow-lg p-3 flex-shrink-0 hover:scale-105 transition-transform"
            >
              <div className="flex flex-col gap-2">
                <Link href={`/movie/${movie.id}`}>
                  <h4 className="text-lg font-semibold text-red-400 hover:underline cursor-pointer">
                    {movie.title}
                  </h4>
                </Link>
                <video controls className="rounded w-full">
                  <source src={movie.url} type="video/mp4" />
                </video>
                {user?.email === "sujanchowdarypuvvada@gmail.com" && (
                  <button
                    onClick={async () => {
                      if (confirm(`Delete "${movie.title}"?`)) {
                        await deleteDoc(doc(db, "movies", movie.id));
                        setMovies((prev) =>
                          prev.filter((m) => m.id !== movie.id)
                        );
                      }
                    }}
                    className="text-sm text-red-400 underline hover:text-red-300 mt-1 self-start"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
