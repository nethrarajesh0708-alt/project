// src/api/loginHandler.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (user_id, password) => {
  try {
    const response = await axios.post(`${BASE_URL}backend/api/auth/login.php`, {
      user_id,
      password,
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  
  );

    return response.data; // success, message
  } catch (error) {
    console.error("Login API Error:", error);
    return { success: false, message: "Something went wrong!" };
  }
};