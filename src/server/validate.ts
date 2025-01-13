import { TurnstileValidateOptions, TurnstileValidateResponse } from "../types";

export async function validateTurnstileToken({
  token,
  secretKey,
  remoteip,
  idempotencyKey,
  sandbox = false,
}: TurnstileValidateOptions): Promise<TurnstileValidateResponse> {
  const endpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

  const formData = new URLSearchParams({
    secret: sandbox ? "1x0000000000000000000000000000000AA" : secretKey,
    response: token,
    ...(remoteip && { remoteip }),
    ...(idempotencyKey && { idempotency_key: idempotencyKey }),
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Failed to validate Turnstile token: ${error}`);
  }
}
