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
export declare function renderTemplate(template: string, data: EmailData): string;
/**
 * Load an email template from file
 */
export declare function loadTemplate(templateName: string): Promise<string>;
/**
 * Render an email from template with data
 */
export declare function renderEmail(templateName: string, data: EmailData): Promise<string>;
/**
 * Email templates configuration
 */
export declare const EMAIL_SUBJECTS: {
    readonly welcome: "Bienvenue chez Inutile Card ! 🎉";
    readonly 'order-confirmation': "Confirmation de commande #{{orderNumber}}";
    readonly 'order-shipped': "Votre commande est en route ! 🚀";
    readonly 'order-delivered': "Votre commande est arrivée ! 🎉";
    readonly 'password-reset': "Réinitialisation de votre mot de passe";
    readonly newsletter: "Newsletter Inutile Card #{{issueNumber}}";
    readonly 'new-article': "Nouvel article : {{articleTitle}}";
    readonly 'review-request': "Votre avis compte pour nous ⭐";
};
/**
 * Get email subject with variables replaced
 */
export declare function getEmailSubject(templateName: keyof typeof EMAIL_SUBJECTS, data?: EmailData): string;
/**
 * Prepare welcome email
 */
export declare function prepareWelcomeEmail(data: {
    firstName: string;
    email: string;
    editorUrl?: string;
    faqUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    unsubscribeUrl?: string;
}): Promise<EmailTemplate>;
/**
 * Prepare order confirmation email
 */
export declare function prepareOrderConfirmationEmail(data: {
    customerName: string;
    orderNumber: string;
    orderDate: string;
    items: Array<{
        name: string;
        price: string;
    }>;
    total: string;
    shippingAddress: string;
    trackOrderUrl?: string;
}): Promise<EmailTemplate>;
/**
 * Prepare order shipped email
 */
export declare function prepareOrderShippedEmail(data: {
    customerName: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
    shippedDate: string;
    carrier: string;
    estimatedDelivery: string;
    shippingAddress: string;
}): Promise<EmailTemplate>;
/**
 * Prepare order delivered email
 */
export declare function prepareOrderDeliveredEmail(data: {
    customerName: string;
    dashboardUrl?: string;
    videoGuideUrl?: string;
    reviewUrl?: string;
}): Promise<EmailTemplate>;
/**
 * Prepare password reset email
 */
export declare function preparePasswordResetEmail(data: {
    firstName: string;
    resetUrl: string;
}): Promise<EmailTemplate>;
/**
 * Prepare newsletter email
 */
export declare function prepareNewsletterEmail(data: {
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
}): Promise<EmailTemplate>;
/**
 * Prepare new article email
 */
export declare function prepareNewArticleEmail(data: {
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
}): Promise<EmailTemplate>;
/**
 * Prepare review request email
 */
export declare function prepareReviewRequestEmail(data: {
    firstName: string;
    reviewUrl: string;
    googleReviewUrl?: string;
    trustpilotUrl?: string;
    productHuntUrl?: string;
    facebookUrl?: string;
    unsubscribeUrl?: string;
}): Promise<EmailTemplate>;
/**
 * Example: Send email using nodemailer (to be implemented)
 */
export declare function sendEmail(to: string, template: EmailTemplate): Promise<void>;
export {};
//# sourceMappingURL=email.d.ts.map