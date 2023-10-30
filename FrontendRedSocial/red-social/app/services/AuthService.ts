import Cookies from "js-cookie";

export async function loginService(loginRequest: any) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Especificamos que estamos enviando datos JSON
    },
    body: JSON.stringify(loginRequest), // Convertimos el objeto JavaScript a formato JSON
  };

  try {
    const response = await fetch("http://localhost:8001/login", options);
    console.log(response.status);
    const token = await response.json();
    Cookies.set("x-token", token.token);
  } catch (error) {
    console.log(error);
  }
}
