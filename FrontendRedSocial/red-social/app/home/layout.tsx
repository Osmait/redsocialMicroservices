import { Navbar } from "@/components/navbar";

import SearchInput from "../components/search-input";
import twLogo from "../../public/iconmonstr-twitter-1-240.png";
import Image from "next/image";
import { Notification } from "../components/Notification";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthValidation } from "../components/authValidation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const token = cookies().get("x-token");
  if (!token) {
    redirect("/login");
  }


  return (
    <section className="flex justify-center">
      <AuthValidation />
      <div className="flex flex-col gap-5 items-center w-1/5 ">
        <Image src={twLogo} alt="logo" className=" h-8 w-8" />
        <Navbar />
        <Notification />
      </div>

      {children}

      <div className="w-1/4 p-4">
        <h1>Search</h1>
        <SearchInput />
      </div>
    </section>
  );
}
