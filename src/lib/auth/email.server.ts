type VerificationEmailInput = {
  to: string;
  name?: string | null;
  url: string;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

export async function sendVerificationEmail({ to, name, url }: VerificationEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("Transactional email is not configured.");

  const safeName = escapeHtml(name?.trim() || "there");
  const safeUrl = escapeHtml(url);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EMP Exclusive <noreply@mail.empexclusive.company>",
      to: [to],
      subject: "Verify your EMP Exclusive email",
      text: `Hi ${name?.trim() || "there"},\n\nVerify your email address to finish setting up your EMP Exclusive account:\n${url}\n\nThis link expires in one hour. If you did not create an account, you can ignore this email.\n\nEMP Exclusive`,
      html: `<!doctype html><html><body style="margin:0;background:#080809;color:#f5f5f5;font-family:Arial,sans-serif;padding:32px 16px"><main style="max-width:560px;margin:0 auto;border:1px solid #29292d;padding:32px"><p style="font-size:12px;letter-spacing:4px;color:#e34242;font-weight:bold">EMP EXCLUSIVE</p><h1 style="font-size:28px">Verify your email</h1><p style="color:#c7c7ca">Hi ${safeName},</p><p style="color:#c7c7ca;line-height:1.7">Confirm this email address to finish setting up your EMP Exclusive account.</p><p style="margin:28px 0"><a href="${safeUrl}" style="display:inline-block;background:#e34242;color:#fff;text-decoration:none;padding:14px 22px;font-weight:bold">Verify email address</a></p><p style="font-size:12px;color:#999">This link expires in one hour. If you did not create an account, you can ignore this email.</p><p style="font-size:12px;color:#777;margin-top:32px">EMP Exclusive · Your ambition. Your own identity.</p></main></body></html>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to send verification email (Resend HTTP ${response.status}).`);
  }
}


/** Send a fixed-recipient delivery test without creating an account or verification token. */
export async function sendEmailDeliveryTest() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("Transactional email is not configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "EMP Exclusive <noreply@mail.empexclusive.company>",
      to: ["empexclusive.planet@gmail.com"],
      subject: "EMP Exclusive email delivery test",
      text: "This is a delivery test from EMP Exclusive. Your Resend sending domain and application email connection are responding.",
      html: "<!doctype html><html><body style=\"margin:0;background:#080809;color:#f5f5f5;font-family:Arial,sans-serif;padding:32px 16px\"><main style=\"max-width:560px;margin:0 auto;border:1px solid #29292d;padding:32px\"><p style=\"font-size:12px;letter-spacing:4px;color:#e34242;font-weight:bold\">EMP EXCLUSIVE</p><h1 style=\"font-size:26px\">Email delivery test</h1><p style=\"color:#c7c7ca;line-height:1.7\">This is a test message from EMP Exclusive. Your Resend sending domain and application email connection are responding.</p><p style=\"font-size:12px;color:#777;margin-top:32px\">EMP Exclusive · Your ambition. Your own identity.</p></main></body></html>",
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to send test email (Resend HTTP ${response.status}).`);
  }
}
