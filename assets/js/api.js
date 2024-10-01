const API_URL = "https://english-center-backend.vercel.app";

function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  return fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: refreshToken,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        logout();
      }
    })
    .catch((error) => {
      console.error("Error refreshing token:", error);
      logout();
    });
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  window.location.href = "../../pages/home/home.php";
}
