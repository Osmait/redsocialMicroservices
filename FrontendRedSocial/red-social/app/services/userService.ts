import { User } from "@/types";

export async function findUser(name: string): Promise<any[]> {
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjE3NjcxNH0.0Pn9P_GWbwTqJ6aM8bv_k4FBV59dT0ZQV_tNZBeT4NQ";
  //   const options = {
  //     headers: {
  //       "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
  //       Authorization: `Bearer ${token}`,
  //       cache: "no-cache",
  //     },
  //   };
  const response = await fetch(`http://127.0.0.1:8080/user/find?name=${name}`);
  const result = await response.json();

  return result;
}

export async function findProfile(id: string): Promise<any> {
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVjNTcwN2Y0LTMyYmMtNDhjZS1hM2JiLWQxYTNkM2Y2NzRkMiIsImV4cCI6MTY5NjE3NjcxNH0.0Pn9P_GWbwTqJ6aM8bv_k4FBV59dT0ZQV_tNZBeT4NQ";
  //   const options = {
  //     headers: {
  //       "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
  //       Authorization: `Bearer ${token}`,
  //       cache: "no-cache",
  //     },
  //   };

  const response = await fetch(`http://127.0.0.1:8080/user/profile/${id}`);
  const result = await response.json();

  return result;
}


export async function findAuthProfile(token: string): Promise<User> {
  const options = {
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch("http://127.0.0.1:5000/api/profile", options);
  const user = await response.json();
  return user

}
