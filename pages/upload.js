import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

export default function UploadPage() {
  const [user, loading] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);
  const router = useRouter();

  // Access control: Only admin allowed
  useEffect(() => {
    if (!loading && user) {
      if (user.email.toLowerCase() !== "sujanchowdarypuvvada@gmail.com") {
        router.replace("/");
      }
    } else if (!user && !loading) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Fetch current uploads
  useEffect(() => {
    const fetchUploads = async () => {
      const snap = await getDocs(collection(db, "movies"));
      const movies = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUploads(movies);
    };

    if (user && user.email.toLowerCase() === "sujanchowdarypuvvada@gmail.com") {
      fetchUploads();
    }
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !url) return alert("Title and video URL are required!");

    await addDoc(collection(db, "movies"), {
      title,
      url,
      banner,
      description,
    });

    setTitle("");
    setUrl("");
    setBanner("");
    setDescription("");

    const snap = await getDocs(collection(db, "movies"));
    setUploads(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this upload?")) {
      await deleteDoc(doc(db, "movies", id));
      setUploads((prev) => prev.filter((movie) => movie.id !== id));
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Upload a New Movie</h1>

      <form onSubmit={handleUpload} className="grid gap-4 max-w-2xl">
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
          required
        />
        <input
          type="text"
          placeholder="Video URL (Cloudinary or direct MP4)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
          required
        />
        <input
          type="text"
          placeholder="Banner Image URL (optional)"
          value={banner}
          onChange={(e) => setBanner(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
        />
        <textarea
          placeholder="Short Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-700"
        ></textarea>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">Uploaded Movies</h2>
      <div className="grid gap-4">
        {uploads.map((movie) => (
          <div
            key={movie.id}
            className="bg-zinc-900 rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-red-400">{movie.title}</h3>
              {movie.description && (
                <p className="text-sm text-gray-300">{movie.description}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(movie.id)}
              className="mt-2 sm:mt-0 text-sm text-red-400 underline hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
