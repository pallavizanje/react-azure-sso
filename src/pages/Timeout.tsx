export default function Timeout() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl text-orange-600 mb-4">Session Timeout</h1>
      <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
        Login Again
      </a>
    </div>
  );
}
