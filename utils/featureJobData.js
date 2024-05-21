const convertFeatureJobData = async (featureJobs) => {
  return await Promise.all(
    featureJobs.map((job) => {
      return converter(job);
    })
  );
};

const converter = (job) => {
  return {
    _id: job?.job_id,
    Contact: "",
    Country: job?.job_country,
    Title: job?.job_title,
    Description: job?.job_description,
    CompanyName: job?.employer_name,
    CompanyDesc: job?.job_naics_name,
    Logo: job?.employer_logo,
    CompanySize: "",
    Contact: "",
    Location: job?.job_city ?? "",
    Address: job?.job_state ?? "",
    EmploymentType: job?.job_employment_type,
    Skills: job?.job_required_skills,
    Experience: 0,
    Deadline: job?.job_offer_expiration_datetime_utc,
    HireNumber: 0,
    isRemote: job?.job_is_remote ?? false,
    resume: "",
    Benefits: job?.job_benefits ?? job?.job_highlights?.Benefits,
    PayMin: job?.job_min_salary,
    PayMax: job?.job_max_salary,
    ApplyLink: job?.job_apply_link,
    Applicants: 0,
    isFeatured: true,
    currency: job?.job_salary_currency,
    frequency: job?.job_salary_period,
    isActive: true,
    published: job?.job_publisher,
    createdAt: job?.job_posted_at_datetime_utc,
    Url: job?.employer_website,
  };
};

module.exports = {
  convertFeatureJobData,
  converter,
};
