"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <div className="flex flex-row justify-between items-center w-[1000px] m-auto p-6">
        <div className="flex flex-row items-center gap-4">
          <img
            src="/arun.jpeg"
            alt="Logo"
            className="h-16 w-16 rounded-full"
          />
          <div className="bg-gradient-to-br from-sky-300 to-indigo-500 bg-clip-text">
            <p className="text-xl font-semibold text-transparent">
              MAHE DUBAI DEMO
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-6">
          <Link
            href="https://labs.heygen.com/interactive-avatar"
            target="_blank"
          >
            Avatars 
          </Link>
          <Link
            href="https://docs.heygen.com/reference/list-voices-v2"
            target="_blank"
          >
            Voices
          </Link>
        </div>
      </div>
    </>
  );
}
