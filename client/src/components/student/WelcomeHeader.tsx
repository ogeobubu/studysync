export default function WelcomeHeader({ name }: { name?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Welcome back, {name || 'Student'}</h1>
      <div className="w-20 h-1 bg-blue-600"></div>
    </div>
  );
}