import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api/",
  baseURL: "https://customizehere.in/api/",
});

export const Token = localStorage.getItem("token");

export const renderUrl = "https://customizehere.in/";
// export const renderUrl = "http://localhost:8000/";

export const backendurl = "http://localhost:8000/";

export const stripeKey =
  "pk_test_51NPirUSGPN3Ia4GzDp4ettFjgq0y46hvVyvRUSNtYbR4FloXp46UBwAVjAkN91LtSWrQS9nGwmlMHnbQHLpumnDB00fmdvs80e";
