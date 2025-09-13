import { useAuth } from "../hooks/useAuth";

export default function Admin() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-xl mb-2">Welcome {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Roles: {user?.roles.join(", ")}</p>
      <button onClick={logout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
        Logout
      </button>
    </div>
  );
}
