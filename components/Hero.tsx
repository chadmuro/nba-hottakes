import Link from "next/link";

export default function Hero() {
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1518407613690-d9fc990e795f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80")`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content py-48">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">NBA Hot Takes</h1>
          <div className="mb-5 text-xl">
            <p className="mb-5">Fire takes for the NBA</p>
            <p>🔥 = Hot take</p>
            <p>❄️ = Cold take</p>
            <p>🗑 = Trash</p>
          </div>
          <Link href="/signup" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
