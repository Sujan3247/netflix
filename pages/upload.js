import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Upload() {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Upload a Movie</h1>
      {!user ? (
        <p className="text-gray-400">Please sign in to upload movies.</p>
      ) : user.email !== "sujanchowdarypuvvada@gmail.com" ? (
        <p className="text-red-400">Only the admin can upload movies.</p>
      ) : (
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
      )}
    </div>
  );
}
