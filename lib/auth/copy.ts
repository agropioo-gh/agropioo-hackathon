/* Single home for user-facing auth copy (plan: Copy centralization).
   English at launch; the DB-driven translation layer absorbs these later. */

export const COPY = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  TOO_MANY_ATTEMPTS: "Too many attempts — please try again later.",
  EMAIL_ALREADY_REGISTERED:
    "This email is already registered. Sign in instead or reset your password.",
  CODE_REJECTED: "That code didn’t work. Check the latest email and try again.",
  UNAUTHORIZED_GENERIC: "This request isn’t allowed.",
  VALIDATION_FALLBACK: "Some details need fixing before we can continue.",
  SERVER_ERROR: "Something went wrong on our side. Please try again.",
  DELIVERY_FAILED:
    "We couldn’t send the code right now. Please try resending in a moment.",
} as const;

export const EMAIL_TEMPLATE = {
  verifySubject: "Your Agropioo verification code",
  resetSubject: "Your Agropioo password-reset code",
  // Preheader hidden in inbox preview next to the subject line.
  // Both variants intentionally leave {code} blank to avoid leaking codes.
  preheader: (code: string) => `
    <span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
      ${code ? `Use ${code} to sign in to Agropioo. Expires in 10 minutes.` : "Use the 6-digit code inside to continue. Expires in 10 minutes."}
    </span>
  `,
  header: `
    <div style="background:#1a472a;padding:28px 0;text-align:center;">
      <span style="display:inline-block;background:#ffffff;padding:10px 18px;border-radius:8px;font-family:DM Sans,Helvetica,Arial,sans-serif;font-weight:700;font-size:18px;color:#1a472a;letter-spacing:0.5px;">
        Agropioo
      </span>
      <p style="margin:14px 0 0;font-family:DM Sans,Helvetica,Arial,sans-serif;font-size:13px;color:#cfe3d4;letter-spacing:0.4px;">
        Farm intelligence, in your pocket.
      </p>
    </div>
  `,
  footer: `
    <div style="background:#f6f8f4;border-top:1px solid #e8f0e2;padding:18px 24px;text-align:center;">
      <p style="margin:0 0 6px;font-family:DM Sans,Helvetica,Arial,sans-serif;font-size:13px;color:#1a472a;font-weight:600;">
        Agropioo · Built for Pakistan
      </p>
      <p style="margin:0;font-family:DM Sans,Helvetica,Arial,sans-serif;font-size:11px;color:#5f6b5f;line-height:1.5;">
        AI-powered farm advisory, weather, and prices — for every farmer,<br />in every village, on any phone.
      </p>
      <p style="margin:10px 0 0;font-family:DM Sans,Helvetica,Arial,sans-serif;font-size:11px;color:#8a948a;">
        You received this because someone (hopefully you) signed up at agropioo.com.<br />
        If it wasn't you, you can safely ignore this email — no account was created.
      </p>
    </div>
  `,
  // Big monospaced code block — survives mobile clients, screen readers,
  // copy-paste, and copy-to-clipboard on every email client we care about.
  codeBlock: (code: string) => `
    <div style="margin:24px 0;">
      <div style="background:#f0f7f1;border:1px dashed #2d6a4f;border-radius:12px;padding:22px 16px;text-align:center;">
        <p style="margin:0 0 10px;font-family:DM Sans,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:1.5px;color:#2d6a4f;text-transform:uppercase;">
          Your 6-digit code
        </p>
        <p style="margin:0;font-family:'JetBrains Mono','IBM Plex Mono',Menlo,Consolas,monospace;font-size:36px;line-height:1;font-weight:700;color:#1a472a;letter-spacing:10px;">
          ${code}
        </p>
      </div>
      <p style="margin:10px 0 0;font-family:DM Sans,Helvetica,Arial,sans-serif;font-size:12px;color:#5f6b5f;text-align:center;">
        Expires in <strong style="color:#1a472a;">10 minutes</strong>. After that, ask for a new code from the sign-in screen.
      </p>
    </div>
  `,
  verifyBody: (code: string) => `
    <div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:DM Sans,Helvetica,Arial,sans-serif;color:#1f2a1f;">
      ${EMAIL_TEMPLATE.preheader(code)}
      ${EMAIL_TEMPLATE.header}
      <div style="padding:28px 28px 8px;">
        <h1 style="margin:0 0 8px;font-family:Playfair Display,Georgia,serif;font-size:24px;line-height:1.2;color:#1a472a;">
          Confirm your email to start farming smarter
        </h1>
        <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:#3a4a3a;">
          Welcome to Agropioo. Enter the code below on the sign-up screen to verify your email and unlock your account.
        </p>
      </div>
      ${EMAIL_TEMPLATE.codeBlock(code)}
      <div style="padding:0 28px 8px;">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#5f6b5f;">
          Didn't request this? You can safely ignore this email — your account won't be created without the code.
        </p>
      </div>
      ${EMAIL_TEMPLATE.footer}
    </div>
  `,
  resetBody: (code: string) => `
    <div style="max-width:600px;margin:0 auto;background:#ffffff;font-family:DM Sans,Helvetica,Arial,sans-serif;color:#1f2a1f;">
      ${EMAIL_TEMPLATE.preheader(code)}
      ${EMAIL_TEMPLATE.header}
      <div style="padding:28px 28px 8px;">
        <h1 style="margin:0 0 8px;font-family:Playfair Display,Georgia,serif;font-size:24px;line-height:1.2;color:#1a472a;">
          Reset your Agropioo password
        </h1>
        <p style="margin:0 0 4px;font-size:15px;line-height:1.6;color:#3a4a3a;">
          Someone (hopefully you) asked to reset the password on this Agropioo account. Use the code below on the reset screen, then choose a new password.
        </p>
      </div>
      ${EMAIL_TEMPLATE.codeBlock(code)}
      <div style="padding:0 28px 8px;">
        <p style="margin:0;font-size:13px;line-height:1.6;color:#5f6b5f;">
          Didn't request this? Your password stays exactly the same — just ignore this email.
        </p>
      </div>
      ${EMAIL_TEMPLATE.footer}
    </div>
  `,
} as const;
