import Link from 'next/link'

export default function MentionsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c14', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#60a5fa', fontSize: '0.82rem', textDecoration: 'none', display: 'block', marginBottom: 32 }}>← Retour à l'accueil</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.03em' }}>Mentions légales</h1>
        <p style={{ color: '#475569', marginBottom: 48 }}>Dernière mise à jour : janvier 2025</p>

        {[
          { title: 'Éditeur du site', content: `RetainHQ est édité par [VOTRE NOM / VOTRE SOCIÉTÉ].\nSiège social : [ADRESSE COMPLÈTE]\nEmail : contact@retainhq.fr\nSIRET : [VOTRE NUMÉRO SIRET]` },
          { title: 'Hébergement', content: `Le site est hébergé par Vercel Inc., 340 Pine Street, 5th Floor, San Francisco, CA 94104, USA. Les données sont stockées via Supabase (UE / France).` },
          { title: 'Propriété intellectuelle', content: `Tous les éléments du site RetainHQ (textes, graphismes, logo, code) sont protégés par le droit d'auteur. Toute reproduction est interdite sans autorisation écrite préalable.` },
          { title: 'Données personnelles', content: `RetainHQ collecte uniquement les données nécessaires au fonctionnement du service (email, nom, données d'usage). Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression. Pour exercer ces droits : contact@retainhq.fr` },
          { title: 'Cookies', content: `RetainHQ utilise uniquement des cookies fonctionnels (session d'authentification). Aucun cookie publicitaire ou traceur tiers n'est utilisé.` },
          { title: 'Droit applicable', content: `Les présentes mentions légales sont soumises au droit français. Tout litige relatif à l'utilisation du site est de la compétence des tribunaux français.` },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 12px' }}>{title}</h2>
            <p style={{ color: '#64748b', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9rem', margin: 0 }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
