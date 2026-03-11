import Link from 'next/link'

export default function CGVPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c14', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '80px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#60a5fa', fontSize: '0.82rem', textDecoration: 'none', display: 'block', marginBottom: 32 }}>← Retour à l'accueil</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.03em' }}>Conditions Générales de Vente</h1>
        <p style={{ color: '#475569', marginBottom: 48 }}>En vigueur depuis janvier 2025</p>

        {[
          { title: '1. Objet', content: `Les présentes CGV régissent l'accès et l'utilisation du service RetainHQ, une plateforme SaaS de suivi de satisfaction client accessible à l'adresse retainhq.fr.` },
          { title: '2. Accès au service', content: `L'accès au service nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants.\n\nUne période d'essai gratuite de 30 jours est offerte à tout nouvel utilisateur, sans engagement ni carte bancaire requise.` },
          { title: '3. Tarification', content: `Starter : 49 € HT / mois — jusqu'à 25 clients actifs\nPro : 99 € HT / mois — clients illimités\n\nLes prix s'entendent hors TVA. La facturation est mensuelle et prélèvée automatiquement via Stripe. Les prix peuvent évoluer avec un préavis de 30 jours.` },
          { title: '4. Résiliation', content: `L'utilisateur peut résilier son abonnement à tout moment en contactant contact@retainhq.fr. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement partiel n'est effectué.` },
          { title: '5. Données client', content: `RetainHQ s'engage à ne jamais céder, louer ou vendre les données de l'utilisateur à des tiers. Les données sont hébergées en Europe. L'utilisateur reste propriétaire de ses données et peut en demander l'export ou la suppression à tout moment.` },
          { title: '6. Disponibilité', content: `RetainHQ s'efforce de maintenir une disponibilité du service à 99,5 %. Des interruptions de maintenance peuvent survenir, de préférence en dehors des heures ouvrées. RetainHQ ne saurait être tenu responsable des dommages liés à une indisponibilité temporaire du service.` },
          { title: '7. Limitation de responsabilité', content: `RetainHQ est un outil d'aide à la décision. L'utilisateur reste seul responsable de l'usage qu'il fait des données collectées. RetainHQ ne peut être tenu responsable des pertes commerciales résultant d'une utilisation du service.` },
          { title: '8. Droit applicable', content: `Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable avant tout recours judiciaire. À défaut, les tribunaux compétents de Paris seront saisis.` },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', margin: '0 0 12px' }}>{title}</h2>
            <p style={{ color: '#64748b', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9rem', margin: 0 }}>{content}</p>
          </div>
        ))}

        <div style={{ marginTop: 48, padding: 20, background: '#111827', border: '1px solid #1e2d45', borderRadius: 10 }}>
          <p style={{ color: '#475569', fontSize: '0.82rem', margin: 0 }}>Contact : <a href="mailto:contact@retainhq.fr" style={{ color: '#60a5fa' }}>contact@retainhq.fr</a></p>
        </div>
      </div>
    </div>
  )
}
