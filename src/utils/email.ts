import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EmailTemplate {
  subject: string;
  html: string;
}

interface EmailData {
  [key: string]: any;
}

/**
 * Replace template variables with actual data
 * Supports {{variable}} and {{#each array}} syntax
 */
export function renderTemplate(template: string, data: EmailData): string {
  let rendered = template;

  // Handle each loops (simple implementation)
  const eachRegex = /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
  rendered = rendered.replace(eachRegex, (match, arrayName, itemTemplate) => {
    const array = data[arrayName];
    if (!Array.isArray(array)) return '';
    
    return array.map(item => {
      let itemHtml = itemTemplate;
      // Replace this.property with actual values
      Object.keys(item).forEach(key => {
        const regex = new RegExp(`\\{\\{this\\.${key}\\}\\}`, 'g');
        itemHtml = itemHtml.replace(regex, item[key]);
      });
      return itemHtml;
    }).join('');
  });

  // Handle if statements (simple implementation)
  const ifRegex = /\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
  rendered = rendered.replace(ifRegex, (match, condition, content) => {
    return data[condition] ? content : '';
  });

  // Replace simple variables
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, data[key] || '');
  });

  return rendered;
}

/**
 * Load an email template from file
 */
export async function loadTemplate(templateName: string): Promise<string> {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
  return await fs.readFile(templatePath, 'utf-8');
}

/**
 * Render an email from template with data
 */
export async function renderEmail(templateName: string, data: EmailData): Promise<string> {
  const template = await loadTemplate(templateName);
  return renderTemplate(template, data);
}

/**
 * Email templates configuration
 */
export const EMAIL_SUBJECTS = {
  welcome: 'Bienvenue chez Inutile Card ! 🎉',
  'order-confirmation': 'Confirmation de commande #{{orderNumber}}',
  'order-shipped': 'Votre commande est en route ! 🚀',
  'order-delivered': 'Votre commande est arrivée ! 🎉',
  'password-reset': 'Réinitialisation de votre mot de passe',
  'newsletter': 'Newsletter Inutile Card #{{issueNumber}}',
  'new-article': 'Nouvel article : {{articleTitle}}',
  'review-request': 'Votre avis compte pour nous ⭐',
} as const;

/**
 * Get email subject with variables replaced
 */
export function getEmailSubject(templateName: keyof typeof EMAIL_SUBJECTS, data: EmailData = {}): string {
  const subject = EMAIL_SUBJECTS[templateName];
  return renderTemplate(subject, data);
}

/**
 * Prepare welcome email
 */
export async function prepareWelcomeEmail(data: {
  firstName: string;
  email: string;
  editorUrl?: string;
  faqUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  unsubscribeUrl?: string;
}): Promise<EmailTemplate> {
  const defaults = {
    editorUrl: 'https://inutile.cards/editor',
    faqUrl: 'https://inutile.cards/faq',
    twitterUrl: 'https://twitter.com/inutilecard',
    linkedinUrl: 'https://linkedin.com/company/inutilecard',
    instagramUrl: 'https://instagram.com/inutilecard',
    unsubscribeUrl: 'https://inutile.cards/unsubscribe',
  };

  const html = await renderEmail('welcome', { ...defaults, ...data });
  const subject = getEmailSubject('welcome', data);

  return { subject, html };
}

/**
 * Prepare order confirmation email
 */
export async function prepareOrderConfirmationEmail(data: {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{ name: string; price: string }>;
  total: string;
  shippingAddress: string;
  trackOrderUrl?: string;
}): Promise<EmailTemplate> {
  const defaults = {
    trackOrderUrl: `https://inutile.cards/track-order?order=${data.orderNumber}`,
  };

  const html = await renderEmail('order-confirmation', { ...defaults, ...data });
  const subject = getEmailSubject('order-confirmation', data);

  return { subject, html };
}

/**
 * Prepare order shipped email
 */
export async function prepareOrderShippedEmail(data: {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  trackingUrl: string;
  shippedDate: string;
  carrier: string;
  estimatedDelivery: string;
  shippingAddress: string;
}): Promise<EmailTemplate> {
  const html = await renderEmail('order-shipped', data);
  const subject = getEmailSubject('order-shipped', data);

  return { subject, html };
}

/**
 * Prepare order delivered email
 */
export async function prepareOrderDeliveredEmail(data: {
  customerName: string;
  dashboardUrl?: string;
  videoGuideUrl?: string;
  reviewUrl?: string;
}): Promise<EmailTemplate> {
  const defaults = {
    dashboardUrl: 'https://inutile.cards/dashboard',
    videoGuideUrl: 'https://inutile.cards/guide',
    reviewUrl: 'https://inutile.cards/review',
  };

  const html = await renderEmail('order-delivered', { ...defaults, ...data });
  const subject = getEmailSubject('order-delivered', data);

  return { subject, html };
}

/**
 * Prepare password reset email
 */
export async function preparePasswordResetEmail(data: {
  firstName: string;
  resetUrl: string;
}): Promise<EmailTemplate> {
  const html = await renderEmail('password-reset', data);
  const subject = getEmailSubject('password-reset', data);

  return { subject, html };
}

/**
 * Prepare newsletter email
 */
export async function prepareNewsletterEmail(data: {
  firstName: string;
  issueNumber: string;
  newsletterTitle: string;
  date: string;
  introText: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  articles: Array<{
    category: string;
    title: string;
    excerpt: string;
    url: string;
  }>;
  featureTitle: string;
  featureDescription: string;
  ctaUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  unsubscribeUrl?: string;
}): Promise<EmailTemplate> {
  const defaults = {
    ctaUrl: 'https://inutile.cards/editor',
    twitterUrl: 'https://twitter.com/inutilecard',
    linkedinUrl: 'https://linkedin.com/company/inutilecard',
    instagramUrl: 'https://instagram.com/inutilecard',
    unsubscribeUrl: 'https://inutile.cards/unsubscribe',
  };

  const html = await renderEmail('newsletter', { ...defaults, ...data });
  const subject = getEmailSubject('newsletter', data);

  return { subject, html };
}

/**
 * Prepare new article email
 */
export async function prepareNewArticleEmail(data: {
  category: string;
  articleTitle: string;
  publishDate: string;
  readTime: string;
  articleExcerpt: string;
  articleUrl: string;
  keyPoints: string[];
  authorName: string;
  authorTitle: string;
  authorInitials: string;
  relatedArticles?: Array<{
    title: string;
    excerpt: string;
    url: string;
  }>;
  ctaUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  unsubscribeUrl?: string;
}): Promise<EmailTemplate> {
  const defaults = {
    ctaUrl: 'https://inutile.cards/editor',
    twitterUrl: 'https://twitter.com/inutilecard',
    linkedinUrl: 'https://linkedin.com/company/inutilecard',
    instagramUrl: 'https://instagram.com/inutilecard',
    unsubscribeUrl: 'https://inutile.cards/unsubscribe',
  };

  const html = await renderEmail('new-article', { ...defaults, ...data });
  const subject = getEmailSubject('new-article', data);

  return { subject, html };
}

/**
 * Prepare review request email
 */
export async function prepareReviewRequestEmail(data: {
  firstName: string;
  reviewUrl: string;
  googleReviewUrl?: string;
  trustpilotUrl?: string;
  productHuntUrl?: string;
  facebookUrl?: string;
  unsubscribeUrl?: string;
}): Promise<EmailTemplate> {
  const defaults = {
    googleReviewUrl: 'https://g.page/r/inutilecard',
    trustpilotUrl: 'https://www.trustpilot.com/review/inutile.cards',
    productHuntUrl: 'https://www.producthunt.com/posts/inutile-card',
    facebookUrl: 'https://www.facebook.com/inutilecard/reviews',
    unsubscribeUrl: 'https://inutile.cards/unsubscribe',
  };

  const html = await renderEmail('review-request', { ...defaults, ...data });
  const subject = getEmailSubject('review-request', data);

  return { subject, html };
}

/**
 * Example: Send email using nodemailer (to be implemented)
 */
export async function sendEmail(to: string, template: EmailTemplate): Promise<void> {
  // TODO: Implement with nodemailer or your preferred email service
  console.log(`Would send email to ${to}`);
  console.log(`Subject: ${template.subject}`);
  console.log(`HTML length: ${template.html.length} characters`);
  
  // Example with nodemailer (commented out):
  /*
  import nodemailer from 'nodemailer';
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@inutile.cards',
    to,
    subject: template.subject,
    html: template.html,
  });
  */
}




