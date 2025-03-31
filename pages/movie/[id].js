import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function MoviePage() {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      const docRef = doc(db, "movies", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMovie(docSnap.data());
      }
    };
    fetchMovie();
  }, [id]);

  if (!movie) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <video controls className="w-full max-w-4xl mb-4 rounded">
        <source src={movie.url} type="video/mp4" />
      </video>
      <p className="max-w-4xl text-gray-300 text-center">{movie.description}</p>
    </div>
  );
}
