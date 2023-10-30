import { User } from "@/types";

export async function findUser(name: string): Promise<User[]> {

  const response = await fetch(`http://127.0.0.1:8080/user/find?name=${name}`);
  const result = await response.json();

  return result;
}

export async function findProfile(id: string): Promise<User> {


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
