import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col dark:bg-white justify-center items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-2 p-2">
        <span className="text-lg text-blue-900 font-semibold">Welcome to the DFCU Human Resource Management System</span>
        <span className="text-sm text-black">Select a role below to get started</span>
        <div className=" flex mt-10 gap-4 ">
          <Link href="/employee">
            <button className="p-2 rounded-sm shadow-md bg-blue-900 text-white hover:bg-white hover:text-blue-900 hover:border-blue-900 border w-fit">Employee</button>
          </Link>
          <Link href="/admin">
            <button className="p-2 rounded-sm shadow-md font-semibold hover:bg-blue-900 hover:text-white bg-white text-blue-900 border-blue-900 border w-fit">Admin</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
