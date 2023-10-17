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
  const response = await fetch(`http://localhost:8080/user/find?name=${name}`);
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

  const response = await fetch(`http://localhost:8080/user/profile/${id}`);
  const result = await response.json();

  return result;
}
