const axios = require("axios");

const getFeatureJobs = async ({
  page = 1,
  num_pages = 1,
  query = "tech",
  remote_jobs_only = false,
  job_titles,
  employment_types,
}) => {
  try {
    const options = {
      method: "GET",
      url: `${process.env.RAPID_API_URL}/search`,
      params: {
        query,
        page,
        num_pages,
        remote_jobs_only,
        job_titles,
        employment_types,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
    };

    const response = await axios.request(options);
    return response.data?.data;
  } catch (error) {
    console.error(error);
  }
};
const getFeatureJob = async ({ id }) => {
  try {
    const options = {
      method: "GET",
      url: `${process.env.RAPID_API_URL}/job-details`,
      params: {
        job_id: id,
      },
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
    };
    const response = await axios.request(options);
    return response.data?.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getFeatureJobs,
  getFeatureJob,
};
