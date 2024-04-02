import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCities(value: string) {
  try {
    const { data } = await axios.get(`${API_URL}/cities?name_like=${value}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}
