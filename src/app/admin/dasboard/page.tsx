import { Admin } from "@/app/types";
import { cookies } from "next/headers";

type ResultData = {
  success: boolean;
  message: string;
  data: Admin;
};
async function getAdminProfile(): Promise<Admin | null> {
  try {
    const cookiesStore = cookies();
    const token = (await cookiesStore).get(`accessToken`);
    const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "APP-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
        Authorization: `Bearer ${token?.value}`,
      },
    });

    const responseData: ResultData = await response.json();
    console.log(responseData);
    if (!response.ok) {
      console.log(responseData?.message);
      return null;
    }

    return responseData.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default async function AdminProfilePage() {
  const adminData = await getAdminProfile();
  if (adminData == null) {
    return <div className="w-full p-5">Sorry, admin data does not exists</div>;
  }
  return (
    <div className="w-full p-5">
      <div className="w-full p-5 bg-sky-50 rounded">
        <h1 className="font-bold text-sky-500 text-xl"></h1>
        Admin Profile
      </div>
      <table>
        <tbody>
          <tr>
            <td className="p-2">name</td>
            <td className="p-2">: {adminData.name}</td>
          </tr>
          <tr>
            <td className="p-2">UserName</td>
            <td className="p-2">: {adminData.user.username}</td>
          </tr>
          <tr>
            <td className="p-2">phone</td>
            <td className="p-2">: {adminData.phone}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}