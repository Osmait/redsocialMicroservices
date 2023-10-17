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
    // const response2 = await fetch("http://127.0.0.1:8001/health");
    // console.log(response2.status);
    // const token2 = await response2.json();
    // console.log(token2);

    const response = await fetch("http://localhost:8001/login", options);
    console.log(response.status);
    const token = await response.json();
    console.log(token);
    Cookies.set("x-token", token.token);
  } catch (error) {
    console.log(error);
  }
}
