import { supabase } from './supabase';

// API Configuration
const LINKEDIN_API_CONFIG = {
  baseUrl: 'https://api.linkedin.com/v2',
  clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
  clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET,
};

const SEEK_API_CONFIG = {
  baseUrl: 'https://api.seek.com.au/v2',
  advertiserId: import.meta.env.VITE_SEEK_ADVERTISER_ID,
  apiKey: import.meta.env.VITE_SEEK_API_KEY,
};

interface JobData {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  company: {
    name: string;
    description: string;
  };
}

interface LinkedInJobPost {
  description: {
    text: string;
  };
  locationPlaces: Array<{
    country: string;
    localizedName: string;
  }>;
  title: string;
  applicationSettings: {
    applyMethod: {
      companyApplyMethod: {
        applicationUrl: string;
      };
    };
  };
}

interface SeekJobPost {
  advertiserId: string;
  jobTitle: string;
  jobDetails: string;
  locationId: string;
  workType: string;
  subclassificationId: string;
  applicationEmail: string;
  applicationFormUrl: string;
}

class JobBoardService {
  private async getLinkedInAccessToken(): Promise<string> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: LINKEDIN_API_CONFIG.clientId,
        client_secret: LINKEDIN_API_CONFIG.clientSecret,
        scope: 'r_liteprofile w_member_social r_emailaddress w_organization_social rw_organization_admin',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get LinkedIn access token');
    }

    const data = await response.json();
    return data.access_token;
  }

  private async postToLinkedIn(jobData: JobData) {
    try {
      const accessToken = await this.getLinkedInAccessToken();
      
      const jobPost: LinkedInJobPost = {
        description: {
          text: `${jobData.description}\n\nRequirements:\n${jobData.requirements.join('\n')}`,
        },
        locationPlaces: [{
          country: 'AU',
          localizedName: jobData.location,
        }],
        title: jobData.title,
        applicationSettings: {
          applyMethod: {
            companyApplyMethod: {
              applicationUrl: `https://app.usesyft.com/jobs/${jobData.id}/apply`,
            },
          },
        },
      };

      const response = await fetch(`${LINKEDIN_API_CONFIG.baseUrl}/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobPost),
      });

      if (!response.ok) {
        throw new Error('Failed to post job to LinkedIn');
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('LinkedIn posting error:', error);
      throw error;
    }
  }

  private async postToSeek(jobData: JobData) {
    try {
      const jobPost: SeekJobPost = {
        advertiserId: SEEK_API_CONFIG.advertiserId,
        jobTitle: jobData.title,
        jobDetails: `${jobData.description}\n\nRequirements:\n${jobData.requirements.join('\n')}`,
        locationId: await this.getSeekLocationId(jobData.location),
        workType: this.mapWorkType(jobData.type),
        subclassificationId: await this.getSeekClassificationId(jobData),
        applicationEmail: 'applications@usesyft.com',
        applicationFormUrl: `https://app.usesyft.com/jobs/${jobData.id}/apply`,
      };

      const response = await fetch(`${SEEK_API_CONFIG.baseUrl}/advertisements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SEEK_API_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobPost),
      });

      if (!response.ok) {
        throw new Error('Failed to post job to Seek');
      }

      const data = await response.json();
      return data.advertisementId;
    } catch (error) {
      console.error('Seek posting error:', error);
      throw error;
    }
  }

  private async getSeekLocationId(location: string): Promise<string> {
    // Call Seek's location API to get the correct location ID
    const response = await fetch(`${SEEK_API_CONFIG.baseUrl}/locations?q=${encodeURIComponent(location)}`, {
      headers: {
        'Authorization': `Bearer ${SEEK_API_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Seek location ID');
    }

    const data = await response.json();
    return data.locations[0]?.id || '';
  }

  private async getSeekClassificationId(jobData: JobData): Promise<string> {
    // Call Seek's classification API to get the correct classification ID
    const response = await fetch(`${SEEK_API_CONFIG.baseUrl}/classifications?q=${encodeURIComponent(jobData.title)}`, {
      headers: {
        'Authorization': `Bearer ${SEEK_API_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get Seek classification ID');
    }

    const data = await response.json();
    return data.classifications[0]?.id || '';
  }

  private mapWorkType(type: string): string {
    const workTypeMap: Record<string, string> = {
      'full-time': 'FullTime',
      'part-time': 'PartTime',
      'contract': 'Contract',
      'casual': 'Casual',
      'temporary': 'Temporary',
    };

    return workTypeMap[type.toLowerCase()] || 'FullTime';
  }

  async distributeJob(jobData: JobData, selectedBoards: string[]) {
    try {
      const postingPromises = [];
      const distributions = [];

      if (selectedBoards.includes('linkedin')) {
        const linkedinPromise = this.postToLinkedIn(jobData).then(externalId => {
          distributions.push({
            job_id: jobData.id,
            platform: 'linkedin',
            external_id: externalId,
            status: 'posted',
            posted_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          });
        });
        postingPromises.push(linkedinPromise);
      }

      if (selectedBoards.includes('seek')) {
        const seekPromise = this.postToSeek(jobData).then(externalId => {
          distributions.push({
            job_id: jobData.id,
            platform: 'seek',
            external_id: externalId,
            status: 'posted',
            posted_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          });
        });
        postingPromises.push(seekPromise);
      }

      await Promise.all(postingPromises);

      // Log job distributions
      if (distributions.length > 0) {
        const { error } = await supabase
          .from('job_distributions')
          .insert(distributions);

        if (error) throw error;
      }

      return distributions;
    } catch (error) {
      console.error('Failed to distribute job:', error);
      throw error;
    }
  }

  async trackJobPerformance(jobId: string) {
    try {
      const { data: distributions, error } = await supabase
        .from('job_distributions')
        .select('*')
        .eq('job_id', jobId);

      if (error) throw error;

      const performanceData = await Promise.all(
        distributions.map(async (dist) => {
          let metrics;

          if (dist.platform === 'linkedin') {
            metrics = await this.getLinkedInMetrics(dist.external_id);
          } else if (dist.platform === 'seek') {
            metrics = await this.getSeekMetrics(dist.external_id);
          }

          if (metrics) {
            // Update distribution metrics
            const { error: updateError } = await supabase
              .from('job_distributions')
              .update(metrics)
              .eq('id', dist.id);

            if (updateError) throw updateError;
          }

          return {
            platform: dist.platform,
            ...metrics,
          };
        })
      );

      return performanceData;
    } catch (error) {
      console.error('Failed to track job performance:', error);
      throw error;
    }
  }

  private async getLinkedInMetrics(externalId: string) {
    try {
      const accessToken = await this.getLinkedInAccessToken();
      const response = await fetch(`${LINKEDIN_API_CONFIG.baseUrl}/jobs/${externalId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get LinkedIn metrics');
      }

      const data = await response.json();
      return {
        views: data.views || 0,
        clicks: data.clicks || 0,
        applications: data.applications || 0,
      };
    } catch (error) {
      console.error('LinkedIn metrics error:', error);
      return null;
    }
  }

  private async getSeekMetrics(externalId: string) {
    try {
      const response = await fetch(`${SEEK_API_CONFIG.baseUrl}/advertisements/${externalId}/metrics`, {
        headers: {
          'Authorization': `Bearer ${SEEK_API_CONFIG.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get Seek metrics');
      }

      const data = await response.json();
      return {
        views: data.views || 0,
        clicks: data.clicks || 0,
        applications: data.applications || 0,
      };
    } catch (error) {
      console.error('Seek metrics error:', error);
      return null;
    }
  }
}

export const jobBoardService = new JobBoardService();