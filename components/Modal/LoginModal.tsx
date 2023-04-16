import Link from "next/link";

export default function LoginModal() {
  return (
    <>
      <input type="checkbox" id="login-modal" className="modal-toggle" />
      <label htmlFor="login-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">You are not logged in</h3>
          <p className="py-4">
            Login now to start posting and reacting to NBA Hot Takes!
          </p>
          <Link href="/login" className="btn">
            Go to login
          </Link>
        </label>
      </label>
    </>
  );
}
