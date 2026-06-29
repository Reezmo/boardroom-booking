import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to_email, event_title, event_date, event_time, boardroom, type } = body;

    if (!to_email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const isCancel = type === 'cancellation';
    const subject = isCancel 
      ? `Cancelled: ${event_title} in ${boardroom}`
      : `Confirmed: ${event_title} in ${boardroom}`;

    // Dynamic variables for the template
    const heroTag = isCancel ? 'Booking Cancelled' : 'Booking Confirmed';
    const heroTitle = isCancel ? 'Meeting cancelled.' : "You're all set.";
    const heroSubtitle = isCancel 
      ? 'Your meeting has been cancelled and the boardroom is now free for others to use.' 
      : 'Your meeting is scheduled and the boardroom has been reserved for you.';
    const heroIcon = isCancel 
      ? `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>` // X icon
      : `<polyline points="20 6 9 17 4 12"></polyline>`; // Check icon

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=DM+Serif+Display&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #F0EDE8; font-family: 'Inter', sans-serif; padding: 40px 16px; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 560px; margin: 0 auto; }
    .brand { text-align: center; margin-bottom: 28px; }
    .brand-name { font-family: 'DM Serif Display', serif; font-size: 24px; color: #1a1a1a; letter-spacing: 0.02em; }
    .card { background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .hero { background: #0E1117; padding: 48px 40px 40px; text-align: center; position: relative; }
    .check-ring { width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.18); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; }
    .check-ring svg { width: 28px; height: 28px; }
    .hero-tag { display: inline-block; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; padding: 4px 14px; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
    .hero h1 { font-family: 'DM Serif Display', serif; font-size: 36px; color: #ffffff; line-height: 1.15; margin-bottom: 10px; }
    .hero p { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.6; }
    .summary { padding: 32px 40px; border-bottom: 1px solid #F0EDE8; }
    .summary-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 18px; }
    .property-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
    .property-row:last-child { margin-bottom: 0; }
    .prop-icon { width: 36px; height: 36px; border-radius: 10px; background: #F7F5F2; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .prop-icon svg { width: 16px; height: 16px; color: #555; }
    .prop-label { font-size: 11px; color: #999; margin-bottom: 2px; }
    .prop-value { font-size: 14px; font-weight: 500; color: #1a1a1a; }
    .date-strip { margin: 0 40px; padding: 24px 0; border-bottom: 1px solid #F0EDE8; display: flex; align-items: center; justify-content: space-between; gap: 0; }
    .date-block { flex: 1; text-align: center; }
    .date-block .ds-label { font-size: 11px; color: #999; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }
    .date-block .ds-value { font-size: 16px; font-weight: 600; color: #1a1a1a; }
    .date-divider { width: 48px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .date-divider .line { width: 1px; height: 24px; background: #ddd; }
    .cta-section { padding: 32px 40px; }
    .btn-primary { display: block; background: #0E1117; color: #fff; text-align: center; padding: 15px 24px; border-radius: 12px; font-size: 14px; font-weight: 500; text-decoration: none; letter-spacing: 0.01em; }
    .footer { margin-top: 28px; text-align: center; padding: 0 8px; }
    .footer p { font-size: 11px; color: #aaa; line-height: 1.7; }
    .footer a { color: #888; text-decoration: underline; }
    .amenities { padding: 24px 40px; display: flex; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid #F0EDE8; }
    .pill { display: flex; align-items: center; gap: 5px; background: #F7F5F2; border-radius: 100px; padding: 6px 14px; font-size: 12px; color: #555; font-weight: 500; }
    .pill svg { width: 14px; height: 14px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="brand">
      <span class="brand-name">RoomReserve</span>
    </div>
    <div class="card">
      <div class="hero">
        <div>
          <div class="check-ring">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${heroIcon}
            </svg>
          </div>
        </div>
        <div class="hero-tag">${heroTag}</div>
        <h1>${heroTitle}</h1>
        <p>${heroSubtitle}</p>
      </div>
      <div class="summary">
        <div class="summary-label">Meeting Details</div>
        <div class="property-row">
          <div class="prop-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <div class="prop-label">Event</div>
            <div class="prop-value">${event_title}</div>
          </div>
        </div>
        <div class="property-row">
          <div class="prop-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div class="prop-label">Boardroom</div>
            <div class="prop-value">${boardroom}</div>
          </div>
        </div>
      </div>
      <div class="date-strip">
        <div class="date-block">
          <div class="ds-label">Date</div>
          <div class="ds-value">${event_date}</div>
        </div>
        <div class="date-divider"><div class="line"></div></div>
        <div class="date-block">
          <div class="ds-label">Time</div>
          <div class="ds-value">${event_time}</div>
        </div>
      </div>
      ${!isCancel ? `
      <div class="amenities">
        <span class="pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          High-Speed WiFi
        </span>
        <span class="pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>
          Presentation Display
        </span>
      </div>
      ` : ''}
      <div class="cta-section">
        <a href="http://localhost:3000/dashboard" class="btn-primary">View on Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>
        RoomReserve Internal Booking System<br>
        <a href="http://localhost:3000/dashboard">Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

    // Send the email via Resend
    const data = await resend.emails.send({
      from: 'RoomReserve <onboarding@resend.dev>', // Change to your verified domain later
      to: [to_email],
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}