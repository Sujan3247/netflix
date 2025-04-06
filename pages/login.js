import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Login() {
  const [isNewUser, setIsNewUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      setVerifying(true); // Show spinner during post-login

      setTimeout(() => {
        const currentUser = auth.currentUser;
        if (currentUser?.email === "sujanchowdarypuvvada@gmail.com") {
          router.push("/upload");
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-white p-10">Loading...</p>;

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-opacity-50"></div>
        <p className="mt-6 text-lg font-semibold animate-pulse">Verifying...</p>
      </div>
    );
  }

  if (user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center">
          {isNewUser ? "Create Account" : "Login to SujanFlix"}
        </h1>
        <input
          type="email"
          required
          placeholder="Email"
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="p-3 rounded bg-zinc-800 text-white border border-zinc-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded"
        >
          {isNewUser ? "Sign Up" : "Login"}
        </button>
        <p
          className="text-sm text-center text-gray-400 cursor-pointer hover:underline"
          onClick={() => setIsNewUser(!isNewUser)}
        >
          {isNewUser
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </p>
      </form>
    </div>
  );
}
