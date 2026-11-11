type AuthFailure = {
  message?: string;
  code?: string;
};

function details(error: AuthFailure) {
  return {
    message: (error.message ?? '').toLowerCase(),
    code: (error.code ?? '').toLowerCase(),
  };
}

export function registrationErrorKey(error: AuthFailure): string {
  const { message, code } = details(error);

  if (
    code === 'user_already_exists' ||
    code === 'email_exists' ||
    message.includes('already registered') ||
    message.includes('already been registered') ||
    message.includes('user already exists') ||
    message.includes('users_email_key')
  ) {
    return 'auth.emailTaken';
  }

  if (message.includes('users_username_key')) {
    return 'auth.usernameTaken';
  }

  if (
    code === 'email_address_invalid' ||
    message.includes('invalid email') ||
    message.includes('unable to validate email')
  ) {
    return 'auth.invalidEmail';
  }

  if (code === 'weak_password' || message.includes('password should')) {
    return 'auth.passwordTooShort';
  }

  if (code === 'over_request_rate_limit' || message.includes('rate limit')) {
    return 'auth.tooManyAttempts';
  }

  if (message.includes('database error saving new user')) {
    return 'auth.emailOrUsernameTaken';
  }

  return 'auth.unexpectedError';
}

export function loginErrorKey(error: AuthFailure): string {
  const { message, code } = details(error);

  if (
    code === 'invalid_credentials' ||
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials')
  ) {
    return 'auth.invalidCredentials';
  }

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'auth.emailNotConfirmed';
  }

  if (code === 'over_request_rate_limit' || message.includes('rate limit')) {
    return 'auth.tooManyAttempts';
  }

  return 'auth.unexpectedError';
}
