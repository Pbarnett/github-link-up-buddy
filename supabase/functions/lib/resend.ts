
export const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
export const RESEND_FROM = "onboarding@resend.dev"; // Default Resend domain - replace with your verified domain

export async function sendEmail({ 
  to, 
  subject, 
  html 
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ 
        from: RESEND_FROM, 
        to, 
        subject, 
        html 
      }),
    });
    
    if (!res.ok) {
      const txt = await res.text();
      console.error("Resend error:", res.status, txt);
      throw new Error(`Resend ${res.status}: ${txt}`);
    }
    
    return await res.json();
  } catch (e) {
    console.error("sendEmail failed:", e);
    throw e;
  }
}
