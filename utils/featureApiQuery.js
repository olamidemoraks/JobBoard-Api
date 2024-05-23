const axios = require("axios");

const rapidApiEnv = (type) => {
  switch (type) {
    case 1:
      return {
        key: process.env.RAPID_API_KEY,
      };
    case 2:
      return {
        key: process.env.RAPID_API_KEY_2nd,
      };
    case 3:
      return {
        key: process.env.RAPID_API_KEY_3rd,
      };

    default:
      break;
  }
};

const getFeatureJobs = async ({
  page = 1,
  num_pages = 1,
  query = "tech",
  remote_jobs_only = false,
  job_titles,
  employment_types,
  type = 1,
}) => {
  const { key } = rapidApiEnv(type);

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
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
    };

    const response = await axios.request(options);
    return response.data?.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
const getFeatureJob = async ({ id, type }) => {
  const { key } = rapidApiEnv(type);

  try {
    const options = {
      method: "GET",
      url: `${process.env.RAPID_API_URL}/job-details`,
      params: {
        job_id: id,
      },
      headers: {
        "X-RapidAPI-Key": key,
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
