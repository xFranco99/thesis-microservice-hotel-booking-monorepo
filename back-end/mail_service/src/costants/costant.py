from config.env_var import EnvVar

MAIL_OTP_TEMPLATE_NAME = 'otp_email'
MAIL_CONFIRMATION_TEMPLATE_NAME = 'confirm_email'
MAIL_CONFIRMED_REFUND = 'confirmed_refund'

URL_CONFIRM_MAIL = EnvVar.AUTH_SERVICE_BASE_URL + '/api/v1/auth/confirm-mail/'