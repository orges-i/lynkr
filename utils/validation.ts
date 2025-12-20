/**
 * Security-focused validation utilities
 * All validations are strict to prevent attacks
 */

/**
 * Validates and sanitizes URLs
 * Only allows http:// and https:// protocols
 * Returns sanitized URL or null if invalid
 */
export const validateUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Reject if too long (prevent DoS)
  if (trimmedUrl.length > 2048) return null;

  try {
    // Attempt to parse as URL
    const parsed = new URL(
      trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`
    );

    // Only allow http and https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    // Return the full valid URL
    return parsed.toString();
  } catch (e) {
    // Invalid URL format
    return null;
  }
};

/**
 * Validates link title/display text
 * Max 200 characters, no script tags
 */
export const validateLinkTitle = (title: string): boolean => {
  if (!title || typeof title !== "string") return false;
  if (title.trim().length === 0) return false;
  if (title.length > 200) return false;
  // Simple check for obvious script attempts
  if (
    title.toLowerCase().includes("<script") ||
    title.toLowerCase().includes("onerror") ||
    title.toLowerCase().includes("onclick")
  ) {
    return false;
  }
  return true;
};

/**
 * Validates user bio
 * Max 500 characters, plain text only
 */
export const validateBio = (bio: string): boolean => {
  if (!bio || typeof bio !== "string") return true; // Bio is optional
  if (bio.length > 500) return false;
  return true;
};

/**
 * Validates username
 * Alphanumeric + underscore, 3-30 characters
 */
export const validateUsername = (username: string): boolean => {
  if (!username || typeof username !== "string") return false;
  if (username.length < 3 || username.length > 30) return false;
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return false;
  return true;
};

/**
 * Validates phone number (basic format)
 * Allows +, digits, spaces, hyphens
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") return false;
  // Simple format: +1234567890 or variations
  if (!/^[\d+\s\-()]+$/.test(phone)) return false;
  if (phone.replace(/\D/g, "").length < 10) return false; // At least 10 digits
  return true;
};

/**
 * Validates email address (basic check)
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize error message for client display
 * Returns generic message if error reveals sensitive info
 */
export const sanitizeErrorMessage = (error: any): string => {
  if (!error) return "An error occurred. Please try again.";

  const message = error?.message || error?.toString() || "";

  // List of sensitive keywords that shouldn't be shown to users
  const sensitiveKeywords = [
    "foreign key",
    "constraint",
    "database",
    "sql",
    "postgres",
    "already exists",
    "unique",
    "relation",
    "table",
    "column",
  ];

  // Check if error contains sensitive info
  const isSensitive = sensitiveKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );

  if (isSensitive) {
    return "An error occurred. Please try again or contact support.";
  }

  // Auth-specific messages (check for specific auth errors)
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("invalid login credentials") ||
    lowerMessage.includes("invalid email or password") ||
    lowerMessage.includes("unauthorized") ||
    (lowerMessage.includes("invalid") && lowerMessage.includes("credentials"))
  ) {
    return "Invalid email or password. Please check and try again.";
  }

  if (lowerMessage.includes("network") || lowerMessage.includes("timeout")) {
    return "Connection error. Please check your internet and try again.";
  }

  // For other errors, show a generic message
  return "An error occurred. Please try again.";
};

/**
 * Rate limiting helper
 * Tracks attempts per identifier (email, IP, etc) with localStorage persistence
 * Returns true if request is allowed, false if rate limited
 */
export class RateLimiter {
  private windowMs: number;
  private maxAttempts: number;
  private storageKey = "lynkr_rate_limit";

  constructor(windowMs: number = 5 * 60 * 1000, maxAttempts: number = 5) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  private getAttempts(identifier: string): number[] {
    try {
      const stored = localStorage.getItem(`${this.storageKey}_${identifier}`);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private setAttempts(identifier: string, attempts: number[]): void {
    try {
      localStorage.setItem(
        `${this.storageKey}_${identifier}`,
        JSON.stringify(attempts)
      );
    } catch {
      // Fail silently if localStorage is unavailable
    }
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.getAttempts(identifier);

    // Filter out old attempts outside the window
    const recentAttempts = attempts.filter(
      (time) => now - time < this.windowMs
    );

    // Check if under limit
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Record new attempt
    recentAttempts.push(now);
    this.setAttempts(identifier, recentAttempts);

    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.getAttempts(identifier);
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const elapsed = Date.now() - oldestAttempt;
    const remaining = Math.max(0, this.windowMs - elapsed);

    return remaining;
  }
}
