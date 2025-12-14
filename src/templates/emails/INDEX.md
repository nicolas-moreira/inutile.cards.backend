# 📧 Index des Templates d'Emails

## Liste Complète des 18 Templates

### 🎯 Lifecycle Utilisateur (3)
1. **welcome.html** - Bienvenue après inscription
2. **card-not-activated.html** - Rappel d'activation 3-7j après livraison
3. **profile-incomplete.html** - Encouragement à compléter le profil

### 🛒 E-commerce & Commandes (6)
4. **order-confirmation.html** - Confirmation immédiate après achat
5. **order-shipped.html** - Notification d'expédition avec tracking
6. **order-delivered.html** - Confirmation de livraison + guide
7. **cart-abandoned-1.html** - Rappel doux 1h après abandon
8. **cart-abandoned-2.html** - Avec promo 10% après 24h
9. **cart-abandoned-3.html** - Dernière chance 25% après 3 jours

### 🔐 Auth & Sécurité (1)
10. **password-reset.html** - Réinitialisation mot de passe

### 📰 Marketing & Engagement (4)
11. **newsletter.html** - Newsletter mensuelle
12. **new-article.html** - Notification nouvel article blog
13. **review-request.html** - Demande d'avis après 2-3 semaines
14. **referral-invite.html** - Programme de parrainage

### 💼 B2B & Prospection (3)
15. **cold-outreach-initial.html** - Premier contact entreprise
16. **cold-outreach-followup.html** - Relance J+3-5
17. **enterprise-demo-invite.html** - Confirmation RDV démo

---

## 🎬 Séquences d'Emails Automatisées

### Séquence 1: Onboarding Nouveau Utilisateur
```
J0  → welcome.html
J3  → card-not-activated.html (si non activée)
J5  → profile-incomplete.html (si < 70% complet)
J21 → review-request.html
J30 → referral-invite.html
```

### Séquence 2: Abandon de Panier
```
+1h    → cart-abandoned-1.html (rappel doux)
+24h   → cart-abandoned-2.html (10% de réduction)
+72h   → cart-abandoned-3.html (25% DERNIÈRE CHANCE)
```

### Séquence 3: Commande
```
Paiement → order-confirmation.html
Expédié  → order-shipped.html
Livré    → order-delivered.html
J+21     → review-request.html
```

### Séquence 4: Prospection B2B
```
J0  → cold-outreach-initial.html
J4  → cold-outreach-followup.html (si pas de réponse)
RDV → enterprise-demo-invite.html (si acceptation)
```

---

## 📊 Quick Stats

- **Total templates:** 18
- **Langues:** Français
- **Design:** Dark mode premium
- **Responsive:** ✅ Mobile + Desktop
- **Taille moyenne:** ~300 lignes HTML
- **Variables moyennes:** 8-12 par template

---

## 🚀 Usage Rapide

```typescript
// Import
import { 
  prepareWelcomeEmail,
  prepareOrderConfirmationEmail,
  prepareCartAbandonedEmail1,
  // ... etc
} from './utils/email';

// Utilisation
const email = await prepareWelcomeEmail({ 
  firstName: 'Nicolas',
  email: 'nicolas@example.com' 
});

await sendEmail('nicolas@example.com', email);
```

---

**📚 Documentation complète:** `EMAIL_TEMPLATES_GUIDE.md`




