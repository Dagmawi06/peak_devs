const { createClient } = require("@supabase/supabase-js");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, message: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return json(500, { ok: false, message: "Server configuration error." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { ok: false, message: "Invalid JSON payload." });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const hp = String(body.hp || "").trim();

  if (hp) {
    return json(400, { ok: false, message: "Spam detected." });
  }

  if (name.length < 2 || name.length > 80) {
    return json(400, { ok: false, message: "Name must be between 2 and 80 characters." });
  }

  if (!EMAIL_REGEX.test(email)) {
    return json(400, { ok: false, message: "Please provide a valid email address." });
  }

  if (message.length < 10 || message.length > 2000) {
    return json(400, { ok: false, message: "Message must be between 10 and 2000 characters." });
  }

  const userAgent = event.headers["user-agent"] || null;
  const pageUrl = event.headers.referer || event.headers.referrer || null;
  const forwarded = event.headers["x-forwarded-for"] || "";
  const ip = (forwarded.split(",")[0] || event.headers["client-ip"] || "").trim() || null;

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
    user_agent: userAgent,
    page_url: pageUrl,
    ip
  });

  if (error) {
    return json(500, { ok: false, message: "Failed to save your message. Please try again." });
  }

  return json(200, { ok: true, message: "Thanks. Your message has been received. We will get back to you soon." });
};