# Email Configuration Setup

## Current Implementation: EmailJS (Client-Side)

The contact form now uses EmailJS for sending emails directly from the browser without requiring server-side authentication or passkeys.

### EmailJS Setup Instructions

1. **Create EmailJS Account**:
   - Go to [emailjs.com](https://www.emailjs.com/)
   - Sign up for a free account

2. **Create Email Service**:
   - In EmailJS dashboard, go to "Email Services"
   - Click "Add New Service"
   - Choose Gmail (or your preferred email provider)
   - Connect your Gmail account
   - Note the **Service ID**

3. **Create Email Template**:
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template structure:
   ```
   Subject: Portfolio Contact: {{subject}}
   
   From: {{from_name}} ({{from_email}})
   Subject: {{subject}}
   
   Message:
   {{message}}
   
   ---
   This message was sent from your portfolio contact form.
   ```
   - Note the **Template ID**

4. **Get Public Key**:
   - Go to "Account" → "General"
   - Copy your **Public Key**

5. **Update Environment Variables**:
   Add these to your `.env.local` file:
   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

### How It Works

- Contact form submissions are sent to: **lekzzicon@gmail.com**
- EmailJS handles the email sending directly from the browser
- No server-side authentication required
- No passkeys or app passwords needed
- Free tier includes 200 emails/month

### Testing

1. Configure your EmailJS credentials in `.env.local`
2. Fill out the contact form on `/contact`
3. Check the recipient email (lekzzicon@gmail.com) for the message

---

## Alternative: Server-Side with Nodemailer (Requires Passkeys)

### Required Environment Variables

Add the following variables to your `.env.local` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this 16-character password as `EMAIL_PASS`

3. **Update Environment Variables**:
   - Set `EMAIL_USER` to your Gmail address
   - Set `EMAIL_PASS` to the generated app password

### Security Notes

- Never commit your `.env.local` file to version control
- Use app passwords, not your regular Gmail password
- The app password should be 16 characters without spaces