const fs = require('fs');

function translateFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [fr, de] of Object.entries(replacements)) {
        content = content.split(fr).join(de);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

// Translate Dashboard.js
const dashboardReplacements = {
    "console.error('Erreur chargement Dashboard:', err);": "console.error('Fehler beim Laden des Dashboards:', err);",
    "// Détection de la commande la plus récente active": "// Erkennung der aktuellsten aktiven Bestellung",
    "// Calculer les statistiques réelles": "// Tatsächliche Statistiken berechnen",
    "// 4. ACTIONS RAPIDES (SANS PANIER)": "// 4. SCHNELLZUGRIFF (OHNE WARENKORB)",
    "// 2. BANNIÈRE COMMANDE ACTIVE (si commande en cours ou récente)": "// 2. BANNER AKTIVE BESTELLUNG (falls Bestellung läuft oder kürzlich)",
    "// 5. COMMANDES RÉCENTES": "// 5. LETZTE BESTELLUNGEN",
    "// 6. BANDEAU DE CONFIANCE & ENGAGEMENTS": "// 6. VERTRAUENSBANNER & VERPFLICHTUNGEN",
    "// 3. STATISTIQUES / KPI CARDS": "// 3. STATISTIKEN / KPI CARDS",
    "// 1. CARTE EN-TÊTE BIENVENUE": "// 1. WILLKOMMENS-HEADER"
};
translateFile('apps/client/src/pages/Dashboard.js', dashboardReplacements);

// Translate Profile.js
const profileReplacements = {
    "Mon Profil Client": "Mein Kundenprofil",
    "Compte Client Vérifié": "Verifiziertes Kundenkonto",
    "Coordonnées & Livraison": "Kontakt & Lieferung",
    "Sécurité & Préférences": "Sicherheit & Einstellungen",
    "Informations de contact & facturation": "Kontakt- & Rechnungsinformationen",
    "Non renseigné": "Nicht angegeben",
    "Téléphone de livraison": "Liefertelefon",
    "Utilisé par le transporteur pour le créneau": "Wird vom Spediteur für das Zeitfenster verwendet",
    "Adresse de dépose": "Lieferadresse",
    "Aucune adresse enregistrée": "Keine Adresse hinterlegt",
    "Accès chariot tout-terrain": "Zugang für Mitnahmestapler",
    "Livraison par chariot embarqué tout-terrain :": "Lieferung mit Mitnahmestapler:",
    "nos palettes de bois sont déposées directement au plus près de votre stockage (abri, garage, cour), sous réserve d'un passage suffisant (largeur minimale d'accès 2,20m).": "Unsere Holzpaletten werden so nah wie möglich an Ihrem Lagerort (Schuppen, Garage, Hof) abgestellt, vorausgesetzt, es ist genügend Platz vorhanden (Mindestdurchfahrtsbreite 2,20m).",
    "Modifier": "Bearbeiten",
    "Nom complet / Société": "Vollständiger Name / Firma",
    "Ex: Jean Dupont": "Z.B.: Max Mustermann",
    "Numéro de téléphone": "Telefonnummer",
    "Ex: 06 12 34 56 78": "Z.B.: 0151 12345678",
    "Adresse (Numéro et nom de rue)": "Adresse (Hausnummer und Straße)",
    "Ex: 15 rue des Chênes": "Z.B.: Eichenstraße 15",
    "Code Postal": "Postleitzahl",
    "Ex: 67000": "Z.B.: 10115",
    "Ville": "Stadt",
    "Ex: Strasbourg": "Z.B.: Berlin",
    "Pays": "Land",
    "Précisions d'accès pour le chariot embarqué (facultatif)": "Zugangsdetails für den Mitnahmestapler (optional)",
    "Ex: Allée gravillonnée, portail de 3m, stockage devant le garage à gauche...": "Z.B.: Schotterweg, 3m Tor, Lagerung vor der Garage links...",
    "Annuler": "Abbrechen",
    "Enregistrement…": "Speichern...",
    "Enregistrer mes coordonnées": "Meine Daten speichern",
    "Nom & Prénom": "Vor- & Nachname",
    "Préférences de communication": "Kommunikationseinstellungen",
    "Notifications de commande & livraison": "Bestell- & Lieferbenachrichtigungen",
    "Recevez par email la confirmation de paiement et les alertes d'acheminement du camion.": "Erhalten Sie per E-Mail Zahlungsbestätigungen und Lieferbenachrichtigungen des LKWs.",
    "Offres spéciales & conseils de chauffage": "Sonderangebote & Heiztipps",
    "Soyez informé des tarifs de saison morte et des conseils de stockage du bois.": "Seien Sie über Preise in der Nebensaison und Tipps zur Holzlagerung informiert.",
    "Sécurité du compte & mot de passe": "Kontosicherheit & Passwort",
    "Mot de passe actuel": "Aktuelles Passwort",
    "Votre mot de passe actuel": "Ihr aktuelles Passwort",
    "Nouveau mot de passe": "Neues Passwort",
    "Minimum 6 caractères": "Mindestens 6 Zeichen",
    "Confirmer le nouveau mot de passe": "Neues Passwort bestätigen",
    "Retapez le nouveau mot de passe": "Neues Passwort erneut eingeben",
    "Mise à jour…": "Wird aktualisiert...",
    "Mettre à jour le mot de passe": "Passwort aktualisieren",
    "Session active sur cet appareil": "Aktive Sitzung auf diesem Gerät",
    "Se déconnecter de Brennholzkaufen": "Von Brennholzkaufen abmelden",
    "Afficher/masquer": "Anzeigen/verbergen",
    "Vos coordonnées ont été enregistrées avec succès !": "Ihre Daten wurden erfolgreich gespeichert!",
    "Erreur lors de la sauvegarde du profil.": "Fehler beim Speichern des Profils.",
    "Préférences enregistrées !": "Einstellungen gespeichert!",
    "Erreur lors de la mise à jour des préférences": "Fehler beim Aktualisieren der Einstellungen",
    "Merci de remplir tous les champs de mot de passe.": "Bitte füllen Sie alle Passwortfelder aus.",
    "Le nouveau mot de passe doit comporter au moins 6 caractères.": "Das neue Passwort muss mindestens 6 Zeichen lang sein.",
    "Les mots de passe ne correspondent pas.": "Die Passwörter stimmen nicht überein.",
    "Mot de passe modifié avec succès !": "Passwort erfolgreich geändert!",
    "Ancien mot de passe incorrect ou erreur.": "Altes Passwort falsch oder Fehler aufgetreten.",
    "Vous avez été déconnecté.": "Sie wurden abgemeldet.",
    "Erreur de déconnexion.": "Fehler beim Abmelden.",
    "France": "Frankreich",
    "Belgique": "Belgien",
    "Luxembourg": "Luxemburg",
    "Suisse": "Schweiz",
    "Allemagne": "Deutschland"
};
translateFile('apps/client/src/pages/Profile.js', profileReplacements);

console.log('Translation complete!');
