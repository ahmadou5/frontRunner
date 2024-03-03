'use client'
import { Frontrun2 } from "@/components/Frontrun/new";
import { Navbar } from "@/components/Navbar";
import { Navbar2 } from "@/components/Navbar/new";
import { GlobalContext } from "@/context/context";
import { Wallet } from "@/suspense/Wallet";
import Image from "next/image";

export default function Home() {
  const {isConnectModal} = GlobalContext()
  const isAddress = true
  return (
    <main className="flex min-h-screen flex-col items-center ">
      <Navbar2 />
       <div className="relative mt-0 flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-yellow-700 before:dark:opacity-10 after:dark:from-[#b99530] after:dark:via-[#ffbb01] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"></div>
      <Frontrun2 />
      {isConnectModal && <Wallet />}
    </main>
  );
}
