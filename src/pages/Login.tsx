import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl mb-4">Login</h1>
      <button onClick={login} className="px-4 py-2 bg-blue-600 text-white rounded">
        Login with Microsoft
      </button>
    </div>
  );
}
