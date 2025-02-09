import { supabase } from './supabase';

interface LinkedInJobPosting {
  jobPostingOperationType: 'CREATE' | 'CLOSE' | 'UPDATE' | 'RENEW';
  companyId: string;
  title: string;
  description: string;
  location: {
    country: string;
    city: string;
  };
  employmentType: string;
  seniorityLevel: string;
  industries: string[];
}

export async function postJobToLinkedIn(jobData: LinkedInJobPosting) {
  try {
    const response = await fetch('https://api.linkedin.com/v2/simpleJobPostings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting job to LinkedIn:', error);
    throw error;
  }
}

export async function closeLinkedInJob(jobId: string) {
  try {
    const response = await fetch(`https://api.linkedin.com/v2/simpleJobPostings/${jobId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobPostingOperationType: 'CLOSE',
      }),
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error closing LinkedIn job:', error);
    throw error;
  }
}

export async function updateLinkedInJob(jobId: string, jobData: Partial<LinkedInJobPosting>) {
  try {
    const response = await fetch(`https://api.linkedin.com/v2/simpleJobPostings/${jobId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobPostingOperationType: 'UPDATE',
        ...jobData,
      }),
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating LinkedIn job:', error);
    throw error;
  }
}
