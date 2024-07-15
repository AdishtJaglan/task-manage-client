import axios from "axios";

const refreshAccessToken = async (token) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/token/refresh/",
      {
        refresh: token,
      }
    );

    const accessToken = response.data.access;
    localStorage.setItem("token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token: " + error.message);
  }
};

export default refreshAccessToken;
