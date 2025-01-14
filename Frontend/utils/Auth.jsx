import axios from "axios";
import { baseURL } from "../src/varibles";

export async function authToken(req, res) {
  try {
    const response = await axios.get(
      `${baseURL}/api/users/token-verify`,
      {
        withCredentials: true,
      }
    );

    return response.data; // Returns true if the token is valid
  } catch (error) {
    return false; // Returns false if the token is invalid
  }
}
