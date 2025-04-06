import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Upload() {
  const [user, loading] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [movieLog, setMovieLog] = useState([]);
  const router = useRouter();

  // 🔐 Redirect non-authenticated or non-admin users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (
      user &&
      user.email?.toLowerCase() !== "sujanchowdarypuvvada@gmail.com"
    ) {
      router.push("/");
    }
  }, [user, loading, router]);

  // 📋 Fetch list of uploaded movies
  useEffect(() => {
    const fetchLog = async () => {
      const snap = await getDocs(collection(db, "movies"));
      setMovieLog(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    if (user?.email?.toLowerCase() === "sujanchowdarypuvvada@gmail.com") {
      fetchLog();
    }
  }, [user]);

  // 🚀 Upload new movie to Firestore
  const uploadMovie = async () => {
    if (!title || !url || !description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setUploading(true);
      await addDoc(collection(db, "movies"), {
        title,
        url,
        description,
        banner: bannerUrl,
        uploadedBy: user.uid,
      });
      alert("Movie uploaded!");
      setTitle("");
      setUrl("");
      setDescription("");
      setBannerUrl("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return <div className="text-white p-10">Checking access...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Upload a Movie</h1>
      <div className="w-full max-w-md flex flex-col gap-4">
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-600"
        />
        <input
          type="text"
          placeholder="Video URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-600"
        />
        <input
          type="text"
          placeholder="Banner Image URL"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-600"
        />
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-600"
          rows={4}
        ></textarea>
        <button
          onClick={uploadMovie}
          className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Movie"}
        </button>
      </div>

      {/* Movie Upload Log */}
      <div className="w-full max-w-xl mt-10">
        <h2 className="text-xl font-semibold mb-2">Upload Log</h2>
        <ul className="text-sm text-gray-300 space-y-2 max-h-60 overflow-y-auto">
          {movieLog.map((m) => (
            <li key={m.id} className="border-b border-gray-700 pb-2">
              🎬 {m.title} — {m.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
