import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const uploadResumes = (formData) =>
  API.post("/upload-resumes", formData);

export const uploadJD = (jd) =>
  API.post("/upload-jd", { jd });

export const getRankings = () =>
  API.get("/rank-candidates");