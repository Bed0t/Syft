import { supabase } from './supabase';

const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
const TWILIO_ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

interface NotificationData {
  to: string;
  subject?: string;
  message: string;
  type: 'email' | 'sms';
}

class NotificationService {
  private async sendEmail({ to, subject, message }: NotificationData) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: 'notifications@usesyft.com', name: 'Syft' },
        subject,
        content: [{ type: 'text/html', value: message }],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }
  }

  private async sendSMS({ to, message }: NotificationData) {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: TWILIO_PHONE_NUMBER,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }
  }

  async sendNotification(data: NotificationData) {
    try {
      if (data.type === 'email') {
        await this.sendEmail(data);
      } else {
        await this.sendSMS(data);
      }

      // Log notification
      const { error } = await supabase
        .from('notification_logs')
        .insert({
          recipient: data.to,
          type: data.type,
          subject: data.subject,
          message: data.message,
          status: 'sent',
        });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  async sendInterviewScheduled(candidateEmail: string, candidatePhone: string, scheduledTime: Date) {
    const emailData = {
      to: candidateEmail,
      subject: 'Your AI Interview has been scheduled',
      message: `
        <h2>Your AI Interview has been scheduled</h2>
        <p>Your interview has been scheduled for ${scheduledTime.toLocaleString()}.</p>
        <p>You will receive a phone call at the scheduled time.</p>
        <p>Please ensure you are in a quiet environment and ready to take the call.</p>
      `,
      type: 'email' as const,
    };

    const smsData = {
      to: candidatePhone,
      message: `Your Syft AI interview is scheduled for ${scheduledTime.toLocaleString()}. Please ensure you are available to take the call.`,
      type: 'sms' as const,
    };

    await Promise.all([
      this.sendNotification(emailData),
      this.sendNotification(smsData),
    ]);
  }

  async sendInterviewReminder(candidateEmail: string, candidatePhone: string, scheduledTime: Date) {
    const emailData = {
      to: candidateEmail,
      subject: 'Reminder: Your AI Interview is coming up',
      message: `
        <h2>Interview Reminder</h2>
        <p>Your AI interview is scheduled in 1 hour at ${scheduledTime.toLocaleString()}.</p>
        <p>Please ensure you are in a quiet environment and ready to take the call.</p>
      `,
      type: 'email' as const,
    };

    const smsData = {
      to: candidatePhone,
      message: `Reminder: Your Syft AI interview is in 1 hour at ${scheduledTime.toLocaleString()}. Please be ready to take the call.`,
      type: 'sms' as const,
    };

    await Promise.all([
      this.sendNotification(emailData),
      this.sendNotification(smsData),
    ]);
  }

  async sendInterviewCompleted(recruiterEmail: string, candidateName: string) {
    await this.sendNotification({
      to: recruiterEmail,
      subject: 'Interview Results Ready',
      message: `
        <h2>Interview Results Ready</h2>
        <p>The AI interview with ${candidateName} has been completed.</p>
        <p>You can now view the results and analysis in your dashboard.</p>
      `,
      type: 'email',
    });
  }
}

export const notificationService = new NotificationService();