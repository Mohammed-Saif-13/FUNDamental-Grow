import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL =
  process.env.EMAIL_FROM || "FUNDamental Grow <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Main email sender
export async function sendEmail({ to, subject, html }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("📧 [DEV] Email:", subject, "to", to);
      return { success: true };
    }

    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    console.log("✅ Email sent:", data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    return { success: false };
  }
}

// Welcome email
export async function sendWelcomeEmail(user) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to FUNDamental Grow!</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>Hi ${user.name}! 🎉</h2>
        <p>Thank you for joining FUNDamental Grow. You can now:</p>
        <ul>
          <li>Create fundraising campaigns</li>
          <li>Support causes you care about</li>
          <li>Track your donations</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${SITE_URL}/campaigns" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Explore Campaigns
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: "Welcome to FUNDamental Grow! 🎉",
    html,
  });
}

// Campaign submitted
export async function sendCampaignSubmittedEmail(campaign, user) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Campaign Submitted!</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>Hi ${user.name}!</h2>
        <p>Your campaign <strong>"${campaign.title}"</strong> has been submitted for review.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Goal:</strong> ₹${campaign.goalAmount.toLocaleString("en-IN")}</p>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${campaign.category}</p>
        </div>
        <p>Our team will review within <strong>24-48 hours</strong>.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Campaign Submitted - ${campaign.title}`,
    html,
  });
}

// Campaign approved
export async function sendCampaignApprovedEmail(campaign, user) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #34d399); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 Congratulations!</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>Campaign Approved!</h2>
        <p>Hi ${user.name},</p>
        <p>Your campaign <strong>"${campaign.title}"</strong> is now <strong>LIVE</strong>! 🚀</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${SITE_URL}/campaigns/${campaign.slug}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Your Campaign
          </a>
        </div>
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px;">
          <p style="margin: 0;"><strong>📢 Next Steps:</strong></p>
          <ol style="margin: 10px 0 0 20px;">
            <li>Share on WhatsApp, Facebook, Instagram</li>
            <li>Post regular updates</li>
            <li>Thank your donors</li>
          </ol>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `🎉 Your Campaign is Live - ${campaign.title}`,
    html,
  });
}

// Campaign rejected
export async function sendCampaignRejectedEmail(campaign, user, reason) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: #6b7280; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Campaign Review Update</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <p>Hi ${user.name},</p>
        <p>Thank you for submitting <strong>"${campaign.title}"</strong>. Unfortunately, we cannot approve it at this time.</p>
        ${
          reason
            ? `
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
          </div>
        `
            : ""
        }
        <p>You can make changes and resubmit. We're here to help!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${SITE_URL}/start-fundraiser" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Submit New Campaign
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Campaign Review Update - ${campaign.title}`,
    html,
  });
}

// Volunteer application submitted
export async function sendVolunteerSubmittedEmail(volunteer) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #a78bfa); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Application Received!</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>Hi ${volunteer.name}! ✅</h2>
        <p>Thank you for applying to become a volunteer with FUNDamental Grow!</p>
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⏰ What's Next?</strong><br>
          We'll review your application within <strong>48-72 hours</strong>.</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: volunteer.email,
    subject: "Volunteer Application Received",
    html,
  });
}

// Volunteer approved
export async function sendVolunteerApprovedEmail(volunteer) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #34d399); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 Welcome to the Team!</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>You're Approved!</h2>
        <p>Hi ${volunteer.name},</p>
        <p>Congratulations! Your volunteer application has been <strong>approved</strong>! 🙌</p>
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>As a Volunteer:</strong></p>
          <ul style="margin: 10px 0 0 20px;">
            <li>Access volunteer dashboard</li>
            <li>View assigned tasks</li>
            <li>Help campaigns succeed</li>
          </ul>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${SITE_URL}/portal/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: volunteer.email,
    subject: "🎉 Welcome to the Team!",
    html,
  });
}

// Volunteer rejected
export async function sendVolunteerRejectedEmail(volunteer, reason) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: #6b7280; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Application Update</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <p>Hi ${volunteer.name},</p>
        <p>Thank you for your interest in volunteering. We're unable to approve your application at this time.</p>
        ${
          reason
            ? `
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
          </div>
        `
            : ""
        }
        <p>You can still support causes by making donations!</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: volunteer.email,
    subject: "Volunteer Application Update",
    html,
  });
}

// Donation receipt
export async function sendDonationReceiptEmail(donation, campaign) {
  if (!donation.donorEmail || donation.anonymous) return { success: true };

  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #34d399); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Thank You! 💚</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>Donation Receipt</h2>
        <p>Dear ${donation.donorName},</p>
        <p>Thank you for your donation to <strong>"${campaign.title}"</strong>!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
              <td style="text-align: right; font-size: 18px; color: #10b981;"><strong>₹${donation.amount.toLocaleString("en-IN")}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;"><strong>Payment ID:</strong></td>
              <td style="text-align: right; padding: 8px 0; border-top: 1px solid #e5e7eb;">${donation.paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-top: 1px solid #e5e7eb;"><strong>Date:</strong></td>
              <td style="text-align: right; padding: 8px 0; border-top: 1px solid #e5e7eb;">${new Date().toLocaleDateString("en-IN")}</td>
            </tr>
          </table>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${SITE_URL}/campaigns/${campaign.slug}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Campaign
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: donation.donorEmail,
    subject: `Thank You for Your Donation - ${campaign.title}`,
    html,
  });
}

// Email verification
export async function sendVerificationEmail(email, token) {
  const verifyUrl = `${SITE_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Verify Your Email</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <p>Thanks for signing up for FUNDamental Grow!</p>
        <p>Please verify your email address by clicking the button below.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link expires in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:<br>${verifyUrl}</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verify Your Email - FUNDamental Grow",
    html,
  });
}

// Password reset email
export async function sendPasswordResetEmail(email, token) {
  const resetUrl = `${SITE_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <p>You requested to reset your password for your FUNDamental Grow account.</p>
        <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">If the button doesn't work, copy and paste this link into your browser:<br>${resetUrl}</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Your Password - FUNDamental Grow",
    html,
  });
}

// Contact acknowledgment
export async function sendContactAcknowledgmentEmail(contact) {
  const html = `
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #fb923c); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Message Received!</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <p>Hi ${contact.name},</p>
        <p>Thank you for contacting us! We've received your message regarding <strong>"${contact.subject}"</strong>.</p>
        <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⏰ Response Time:</strong><br>
          We'll get back to you within <strong>24-48 hours</strong>.</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: contact.email,
    subject: "We received your message - FUNDamental Grow",
    html,
  });
}

/**
 * Send fundraiser approval email
 */
export async function sendFundraiserApprovedEmail({
  email,
  name,
  campaignTitle,
  campaignSlug,
}) {
  const campaignUrl = `${process.env.NEXT_PUBLIC_APP_URL}/campaigns/${campaignSlug}`;

  const subject = "🎉 Your Fundraiser Has Been Approved!";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f97316;">Great News, ${name}!</h2>
      <p>Your fundraiser request has been approved and is now live on FUNDamental Grow.</p>
      
      <div style="background: #fff7ed; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #ea580c;">Campaign Details:</h3>
        <p style="margin: 5px 0;"><strong>Title:</strong> ${campaignTitle}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> Active & Live</p>
      </div>

      <a href="${campaignUrl}" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        View Your Campaign
      </a>

      <p style="color: #666; margin-top: 20px;">Share your campaign link to start receiving donations!</p>
      
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        FUNDamental Grow - Making a Difference Together
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}

/**
 * Send fundraiser rejection email
 */
export async function sendFundraiserRejectedEmail({
  email,
  name,
  campaignTitle,
  reason,
}) {
  const subject = "Update on Your Fundraiser Request";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">Fundraiser Request Update</h2>
      <p>Hello ${name},</p>
      <p>Thank you for submitting your fundraiser request for "${campaignTitle}".</p>
      
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
        <p style="margin: 0;"><strong>Unfortunately, we cannot approve your request at this time.</strong></p>
        ${reason ? `<p style="margin: 10px 0 0 0; color: #666;">Reason: ${reason}</p>` : ""}
      </div>

      <p>You can submit a new request addressing the concerns, or contact us for more information.</p>
      
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/start-fundraiser" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">
        Submit New Request
      </a>

      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        FUNDamental Grow - Making a Difference Together
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
}
