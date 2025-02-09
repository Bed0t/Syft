import { supabase } from './supabase';
import { SYNTHFLOW_API_KEY } from './env';

const SYNTHFLOW_API_URL = 'https://api.synthflow.ai/v1';

interface CandidateData {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
}

interface InterviewResult {
  id: string;
  status: 'completed' | 'failed';
  scores: {
    technical: number;
    communication: number;
    cultural: number;
    overall: number;
  };
  transcript: string;
  questions: Array<{
    question: string;
    answer: string;
    score: number;
  }>;
}

class SynthflowService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${SYNTHFLOW_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${SYNTHFLOW_API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Synthflow API error: ${response.statusText}`);
    }

    return response.json();
  }

  async initiateInterview(candidateData: CandidateData) {
    try {
      // Schedule interview with Synthflow
      const synthflowResponse = await this.request('/interviews', {
        method: 'POST',
        body: JSON.stringify({
          candidate: {
            name: candidateData.name,
            email: candidateData.email,
            phone: candidateData.phone,
          },
          job_id: candidateData.jobId,
        }),
      });

      // Create interview record in database
      const { data: interview, error } = await supabase
        .from('interviews')
        .insert({
          candidate_id: candidateData.id,
          job_id: candidateData.jobId,
          synthflow_interview_id: synthflowResponse.id,
          scheduled_at: new Date(),
          status: 'scheduled',
        })
        .select()
        .single();

      if (error) throw error;

      return interview;
    } catch (error) {
      console.error('Failed to initiate interview:', error);
      throw error;
    }
  }

  async getInterviewResults(interviewId: string): Promise<InterviewResult> {
    try {
      const { data: interview, error: fetchError } = await supabase
        .from('interviews')
        .select('synthflow_interview_id')
        .eq('id', interviewId)
        .single();

      if (fetchError) throw fetchError;

      const result = await this.request(`/interviews/${interview.synthflow_interview_id}`);

      // Update interview record with results
      const { error: updateError } = await supabase
        .from('interviews')
        .update({
          status: result.status,
          technical_score: result.scores.technical,
          communication_score: result.scores.communication,
          cultural_score: result.scores.cultural,
          overall_score: result.scores.overall,
          transcript: result.transcript,
          completed_at: result.status === 'completed' ? new Date() : null,
        })
        .eq('id', interviewId);

      if (updateError) throw updateError;

      // Store individual question results
      if (result.questions) {
        const { error: questionsError } = await supabase
          .from('interview_questions')
          .insert(
            result.questions.map(q => ({
              interview_id: interviewId,
              question: q.question,
              answer: q.answer,
              score: q.score,
            }))
          );

        if (questionsError) throw questionsError;
      }

      return result;
    } catch (error) {
      console.error('Failed to get interview results:', error);
      throw error;
    }
  }

  async getInterviewTranscript(interviewId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('interviews')
        .select('transcript')
        .eq('id', interviewId)
        .single();

      if (error) throw error;
      return data.transcript;
    } catch (error) {
      console.error('Failed to get interview transcript:', error);
      throw error;
    }
  }
}

export const synthflowService = new SynthflowService();