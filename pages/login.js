import { useState } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCred.user);
        alert("Verification email sent! Please check your inbox and verify your email.");
        return;
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        if (!userCred.user.emailVerified) {
          alert("Please verify your email before logging in.");
          await signOut(auth);
          return;
        }

        router.push("/intro");
      }
    } catch (err) {
      setError("Invalid credentials or network error.");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dijp53vwi/image/upload/v1744081928/IMG_1402_pjqhns.jpg')`,
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-20">
        <h1 className="text-3xl font-bold text-red-600">SujanFlix</h1>
        <button
          onClick={() => setIsSignup(false)}
          className="bg-red-600 px-4 py-2 rounded text-white font-semibold hover:bg-red-500"
        >
          Sign In
        </button>
      </div>

      {/* Main form */}
      <div className="relative z-10 max-w-2xl text-center px-4 py-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
          Unlimited movies, TV shows, and more.
        </h1>
        <p className="text-lg sm:text-xl mb-4">Watch anywhere. Cancel anytime.</p>
        <p className="text-sm sm:text-base mb-6">
          Ready to watch? Enter your email to {isSignup ? "create" : "sign in to"} your account.
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded bg-zinc-800 border border-zinc-700 w-full sm:w-2/3"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded bg-zinc-800 border border-zinc-700 w-full sm:w-2/3"
          />
          <button
            type="submit"
            className="bg-red-600 px-6 py-3 rounded font-bold hover:bg-red-500 w-full sm:w-auto"
          >
            {isSignup ? "Get Started" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-300">
          {isSignup ? "Already a user?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-red-400 underline hover:text-red-300"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
