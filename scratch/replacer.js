const fs = require('fs');
const path = require('path');

const file = 'c:\\Users\\myspa\\Documents\\Ecom bois\\apps\\client\\src\\pages\\Profile.js';
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ["toast.success('Ihre Daten wurden erfolgreich gespeichert!');", "toast.success(t('profile.toast_data_saved', 'Ihre Daten wurden erfolgreich gespeichert!'));"],
  ["toast.error('Fehler beim Speichern des Profils.');", "toast.error(t('profile.toast_data_error', 'Fehler beim Speichern des Profils.'));"],
  ["toast.success('Einstellungen gespeichert!');", "toast.success(t('profile.toast_settings_saved', 'Einstellungen gespeichert!'));"],
  ["toast.error('Fehler beim Aktualisieren der Einstellungen');", "toast.error(t('profile.toast_settings_error', 'Fehler beim Aktualisieren der Einstellungen'));"],
  ["toast.error('Bitte füllen Sie alle Passwortfelder aus.');", "toast.error(t('profile.toast_password_fields_empty', 'Bitte füllen Sie alle Passwortfelder aus.'));"],
  ["toast.error('Das neue Passwort muss mindestens 6 Zeichen lang sein.');", "toast.error(t('profile.toast_password_too_short', 'Das neue Passwort muss mindestens 6 Zeichen lang sein.'));"],
  ["toast.error('Die Passwörter stimmen nicht überein.');", "toast.error(t('profile.toast_password_mismatch', 'Die Passwörter stimmen nicht überein.'));"],
  ["toast.success('Passwort erfolgreich geändert!');", "toast.success(t('profile.toast_password_success', 'Passwort erfolgreich geändert!'));"],
  ["toast.error('Altes Passwort falsch oder Fehler aufgetreten.');", "toast.error(t('profile.toast_password_wrong', 'Altes Passwort falsch oder Fehler aufgetreten.'));"],
  ["toast.success('Sie wurden abgemeldet.');", "toast.success(t('profile.toast_logout_success', 'Sie wurden abgemeldet.'));"],
  ["toast.error('Fehler beim Abmelden.');", "toast.error(t('profile.toast_logout_error', 'Fehler beim Abmelden.'));"],

  ["<h1>{userData?.displayName || 'Mein Kundenprofil'}</h1>", "<h1>{userData?.displayName || t('profile.title', 'Mein Kundenprofil')}</h1>"],
  ["<FaShieldAlt size={12} /> Verifiziertes Kundenkonto", "<FaShieldAlt size={12} /> {t('profile.verified_account', 'Verifiziertes Kundenkonto')}"],
  ["<FiUser size={16} /> Kontakt & Lieferung", "<FiUser size={16} /> {t('profile.tab_contact', 'Kontakt & Lieferung')}"],
  ["<FiLock size={16} /> Sicherheit & Einstellungen", "<FiLock size={16} /> {t('profile.tab_security', 'Sicherheit & Einstellungen')}"],

  ["<span>Kontakt- & Rechnungsinformationen</span>", "<span>{t('profile.contact_billing_info', 'Kontakt- & Rechnungsinformationen')}</span>"],
  ["<FiEdit3 size={13} /> Bearbeiten", "<FiEdit3 size={13} /> {t('profile.edit_btn', 'Bearbeiten')}"],
  ["<span className=\"lbl\"><FiUser size={12} /> Vor- & Nachname</span>", "<span className=\"lbl\"><FiUser size={12} /> {t('profile.first_last_name', 'Vor- & Nachname')}</span>"],
  ["<span className=\"val\">{userData?.displayName || 'Nicht angegeben'}</span>", "<span className=\"val\">{userData?.displayName || t('profile.not_specified', 'Nicht angegeben')}</span>"],
  ["<span className=\"lbl\"><FiPhone size={12} /> Liefertelefon</span>", "<span className=\"lbl\"><FiPhone size={12} /> {t('profile.delivery_phone', 'Liefertelefon')}</span>"],
  ["<span className=\"val\">{userData?.phone || 'Nicht angegeben'}</span>", "<span className=\"val\">{userData?.phone || t('profile.not_specified', 'Nicht angegeben')}</span>"],
  ["<span className=\"sub\">Wird vom Spediteur für das Zeitfenster verwendet</span>", "<span className=\"sub\">{t('profile.phone_sub', 'Wird vom Spediteur für das Zeitfenster verwendet')}</span>"],
  ["<span className=\"lbl\"><FiMapPin size={12} /> Lieferadresse</span>", "<span className=\"lbl\"><FiMapPin size={12} /> {t('profile.delivery_address', 'Lieferadresse')}</span>"],
  [": 'Keine Adresse hinterlegt'", ": t('profile.no_address', 'Keine Adresse hinterlegt')"],
  ["<span className=\"lbl\" style={{ color: '#166534' }}><FiTruck size={12} /> Zugang für Mitnahmestapler</span>", "<span className=\"lbl\" style={{ color: '#166534' }}><FiTruck size={12} /> {t('profile.forklift_access', 'Zugang für Mitnahmestapler')}</span>"],
  
  ["<strong>Lieferung mit Mitnahmestapler:</strong> Unsere Holzpaletten werden so nah wie möglich an Ihrem Lagerort (Schuppen, Garage, Hof) abgestellt, vorausgesetzt, es ist genügend Platz vorhanden (Mindestdurchfahrtsbreite 2,20m).", "<strong>{t('profile.forklift_delivery', 'Lieferung mit Mitnahmestapler:')}</strong> {t('profile.forklift_desc', 'Unsere Holzpaletten werden so nah wie möglich an Ihrem Lagerort (Schuppen, Garage, Hof) abgestellt, vorausgesetzt, es ist genügend Platz vorhanden (Mindestdurchfahrtsbreite 2,20m).')}"],

  ["<label>Vollständiger Name / Firma</label>", "<label>{t('profile.full_name_company', 'Vollständiger Name / Firma')}</label>"],
  ["placeholder=\"Z.B.: Max Mustermann\"", "placeholder={t('profile.placeholder_name', 'Z.B.: Max Mustermann')}"],
  ["<label>Telefonnummer</label>", "<label>{t('profile.phone_number', 'Telefonnummer')}</label>"],
  ["placeholder=\"Z.B.: 0151 12345678\"", "placeholder={t('profile.placeholder_phone', 'Z.B.: 0151 12345678')}"],
  ["<label>Adresse (Hausnummer und Straße)</label>", "<label>{t('profile.address_street', 'Adresse (Hausnummer und Straße)')}</label>"],
  ["placeholder=\"Z.B.: Eichenstraße 15\"", "placeholder={t('profile.placeholder_address', 'Z.B.: Eichenstraße 15')}"],
  ["<label>Postleitzahl</label>", "<label>{t('profile.postal_code', 'Postleitzahl')}</label>"],
  ["placeholder=\"Z.B.: 10115\"", "placeholder={t('profile.placeholder_postal', 'Z.B.: 10115')}"],
  ["<label>Stadt</label>", "<label>{t('profile.city', 'Stadt')}</label>"],
  ["placeholder=\"Z.B.: Berlin\"", "placeholder={t('profile.placeholder_city', 'Z.B.: Berlin')}"],
  ["<label>Land</label>", "<label>{t('profile.country', 'Land')}</label>"],
  
  ["<option value=\"Frankreich\">Frankreich</option>", "<option value=\"Frankreich\">{t('profile.country_france', 'Frankreich')}</option>"],
  ["<option value=\"Belgien\">Belgien</option>", "<option value=\"Belgien\">{t('profile.country_belgium', 'Belgien')}</option>"],
  ["<option value=\"Luxemburg\">Luxemburg</option>", "<option value=\"Luxemburg\">{t('profile.country_luxembourg', 'Luxemburg')}</option>"],
  ["<option value=\"Schweiz\">Schweiz</option>", "<option value=\"Schweiz\">{t('profile.country_switzerland', 'Schweiz')}</option>"],
  ["<option value=\"Deutschland\">Deutschland</option>", "<option value=\"Deutschland\">{t('profile.country_germany', 'Deutschland')}</option>"],

  ["<label>Zugangsdetails für den Mitnahmestapler (optional)</label>", "<label>{t('profile.access_details', 'Zugangsdetails für den Mitnahmestapler (optional)')}</label>"],
  ["placeholder=\"Z.B.: Schotterweg, 3m Tor, Lagerung vor der Garage links...\"", "placeholder={t('profile.placeholder_access', 'Z.B.: Schotterweg, 3m Tor, Lagerung vor der Garage links...')}"],
  ["<FiX size={15} /> Abbrechen", "<FiX size={15} /> {t('profile.cancel', 'Abbrechen')}"],
  ["{savingDetails ? 'Speichern...' : 'Meine Daten speichern'}", "{savingDetails ? t('profile.saving', 'Speichern...') : t('profile.save_data', 'Meine Daten speichern')}"],

  ["<span>Kommunikationseinstellungen</span>", "<span>{t('profile.communication_settings', 'Kommunikationseinstellungen')}</span>"],
  ["Bestell- & Lieferbenachrichtigungen", "{t('profile.order_delivery_notifs', 'Bestell- & Lieferbenachrichtigungen')}"],
  ["Erhalten Sie per E-Mail Zahlungsbestätigungen und Lieferbenachrichtigungen des LKWs.", "{t('profile.order_delivery_desc', 'Erhalten Sie per E-Mail Zahlungsbestätigungen und Lieferbenachrichtigungen des LKWs.')}"],
  ["Sonderangebote & Heiztipps", "{t('profile.promos_tips', 'Sonderangebote & Heiztipps')}"],
  ["Seien Sie über Preise in der Nebensaison und Tipps zur Holzlagerung informiert.", "{t('profile.promos_tips_desc', 'Seien Sie über Preise in der Nebensaison und Tipps zur Holzlagerung informiert.')}"],

  ["<span>Kontosicherheit & Passwort</span>", "<span>{t('profile.account_security', 'Kontosicherheit & Passwort')}</span>"],
  ["<label>Aktuelles Passwort</label>", "<label>{t('profile.current_password', 'Aktuelles Passwort')}</label>"],
  ["placeholder=\"Ihr aktuelles Passwort\"", "placeholder={t('profile.placeholder_current_password', 'Ihr aktuelles Passwort')}"],
  ["aria-label=\"Anzeigen/verbergen\"", "aria-label={t('profile.show_hide', 'Anzeigen/verbergen')}"],
  ["<label>Neues Passwort</label>", "<label>{t('profile.new_password', 'Neues Passwort')}</label>"],
  ["placeholder=\"Mindestens 6 Zeichen\"", "placeholder={t('profile.placeholder_new_password', 'Mindestens 6 Zeichen')}"],
  ["<label>Neues Passwort bestätigen</label>", "<label>{t('profile.confirm_new_password', 'Neues Passwort bestätigen')}</label>"],
  ["placeholder=\"Neues Passwort erneut eingeben\"", "placeholder={t('profile.placeholder_confirm_new_password', 'Neues Passwort erneut eingeben')}"],
  ["{passwordLoading ? 'Wird aktualisiert...' : 'Passwort aktualisieren'}", "{passwordLoading ? t('profile.updating', 'Wird aktualisiert...') : t('profile.update_password', 'Passwort aktualisieren')}"],
  ["Aktive Sitzung auf diesem Gerät", "{t('profile.active_session', 'Aktive Sitzung auf diesem Gerät')}"],
  ["<FiLogOut size={15} /> Von Brennholzkaufen abmelden", "<FiLogOut size={15} /> {t('profile.logout', 'Von Brennholzkaufen abmelden')}"]
];

for (const [from, to] of replacements) {
  content = content.replace(from, to);
}

fs.writeFileSync(file, content);
console.log('done');
