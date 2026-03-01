/**
 * Authentication utilities and helpers
 */

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  displayName: string;
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: '' };
};

/**
 * Validates signup data
 */
export const validateSignupData = (data: SignupData): { valid: boolean; message: string } => {
  if (!data.displayName.trim()) {
    return { valid: false, message: 'Please enter your name' };
  }
  
  if (!validateEmail(data.email)) {
    return { valid: false, message: 'Please enter a valid email' };
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }
  
  return { valid: true, message: '' };
};

/**
 * Validates login data
 */
export const validateLoginData = (data: AuthCredentials): { valid: boolean; message: string } => {
  if (!validateEmail(data.email)) {
    return { valid: false, message: 'Please enter a valid email' };
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }
  
  return { valid: true, message: '' };
};

/**
 * Get error message from auth error
 */
export const getAuthErrorMessage = (error: unknown): string => {
  const err = error as { message?: string; code?: string };
  
  if (err?.message) {
    return err.message;
  }
  
  if (err?.code === 'user_not_found') {
    return 'No account found with this email. Please sign up.';
  }
  
  if (err?.code === 'invalid_credential') {
    return 'Invalid email or password.';
  }
  
  if (err?.code === 'email_already_taken') {
    return 'An account with this email already exists.';
  }
  
  return 'Authentication failed. Please try again.';
};
