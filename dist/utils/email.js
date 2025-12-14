import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Replace template variables with actual data
 * Supports {{variable}} and {{#each array}} syntax
 */
export function renderTemplate(template, data) {
    let rendered = template;
    // Handle each loops (simple implementation)
    const eachRegex = /\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    rendered = rendered.replace(eachRegex, (match, arrayName, itemTemplate) => {
        const array = data[arrayName];
        if (!Array.isArray(array))
            return '';
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
export async function loadTemplate(templateName) {
    const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
    return await fs.readFile(templatePath, 'utf-8');
}
/**
 * Render an email from template with data
 */
export async function renderEmail(templateName, data) {
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
};
/**
 * Get email subject with variables replaced
 */
export function getEmailSubject(templateName, data = {}) {
    const subject = EMAIL_SUBJECTS[templateName];
    return renderTemplate(subject, data);
}
/**
 * Prepare welcome email
 */
export async function prepareWelcomeEmail(data) {
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
export async function prepareOrderConfirmationEmail(data) {
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
export async function prepareOrderShippedEmail(data) {
    const html = await renderEmail('order-shipped', data);
    const subject = getEmailSubject('order-shipped', data);
    return { subject, html };
}
/**
 * Prepare order delivered email
 */
export async function prepareOrderDeliveredEmail(data) {
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
export async function preparePasswordResetEmail(data) {
    const html = await renderEmail('password-reset', data);
    const subject = getEmailSubject('password-reset', data);
    return { subject, html };
}
/**
 * Prepare newsletter email
 */
export async function prepareNewsletterEmail(data) {
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
export async function prepareNewArticleEmail(data) {
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
export async function prepareReviewRequestEmail(data) {
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
export async function sendEmail(to, template) {
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
//# sourceMappingURL=email.js.map