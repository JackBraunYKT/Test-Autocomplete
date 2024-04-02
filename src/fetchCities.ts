import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCities(value: string, controller: AbortController) {
  try {
    const { data } = await axios.get(`${API_URL}/cities?name_like=${value}`, {
      signal: controller.signal,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
}
