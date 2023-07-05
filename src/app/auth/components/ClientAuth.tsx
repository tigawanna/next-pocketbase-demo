"use client";
import { pb } from "@/state/pb/client_config";
import { loginUser } from "@/state/user/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface ClientAuthProps {}

export function ClientAuth({}: ClientAuthProps) {
  const [user, setUser] = useState({ identity: "", password: "" });
  const router = useRouter();
  const search_params = useSearchParams().get("next");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const pb_user = await loginUser({
        pb,
        user: user.identity,
        password: user.password,
      });
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      if (search_params) {
        // console.log("next page = ",search_params);
        router.push(search_params);
      } else {
        router.push("/");
      }

      // console.log("auth success = ",pb_user);
      return pb_user;
    } catch (error: any) {
      console.log("error logging in user === ", error.originalError);
      throw error;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="md:w-[60%] min-h-[50%] flex flex-col 
        border shadow shadow-slate-300 items-center justify-center gap-2 p-4 rounded">
        <input
          onChange={handleChange}
          type="text"
          name="identity"
          className="px-1 w-full "
          placeholder="username or email"
        />
        <input onChange={handleChange} type="password" name="password" className="px-1 w-full " />

        <button type="submit" className="w-[70%] px-1 bg-slate-700 ">
          Auth
        </button>
      </form>
    </div>
  );
}
