import database from "../database.js";

/**
 * Bestellung suchen anhand beliebiger Suchbegriffe. Es werden alle Bestellungen
 * ermittelt, die den gesuchten Suchbegriff in einem ihrer Textfelder enthalten.
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Bestellung
 */
export async function search(query) {
    let result = database.db.data.bestellung;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.BestellNR.toLowerCase().includes(query)
                || entry.Lieferadresse.toLowerCase().includes(query);
        });
    }

    return result;
}

/**
 * Anlegen einer neuen Bestellung.
 * 
 * @param {Object} snippet Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten
 */
export async function create(bestellung) {
    if (!bestellung) return;

    let entry = {
        id:       database.getNextId(database.db.data.bestellung),
        BestellNR:  bestellung.BestellNR,
        Lieferadresse: `${bestellung.Lieferadresse || ""}`.trim(),
    };

    validatebestellung(entry);
    database.db.data.bestellung.push(entry);
    await database.db.write();

    return entry;
}

/**
 * Auslesen eine Bestellung anhand der ID.
 * 
 * @param {integer} id Bestellungs ID
 * @returns {Promise<Object>} Bestellung oder undefined
 */
export async function read(id) {
    let index = database.findIndex(database.db.data.bestellung, parseInt(id));
    if (index >= 0) return database.db.data.bestellung[index];
}

/**
 * Aktualisieren einer Bestellung durch Überschreiben einzelner Felder
 * oder des gesamten Bestellungs-Objekts.
 * 
 * @param {integer} id Bestellungs ID
 * @param {Object} snippet Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten oder undefined
 */
export async function update(id, bestellung) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (bestellung.BestellNR) existing.BestellNR = bestellung.BestellNR;
    if (bestellung.Lieferadresse) existing.Lieferadresse = `${bestellung.Lieferadresse || ""}`.trim();

    validatebestellung(existing);
    await database.db.write();

    return existing;
}

/**
 * Löschen einer Bestellung anhand seiner ID.
 * 
 * @param {integer} id Bestellungs ID
 * @returns {Promise<integer>} Anzahl der gelöschten Datensätze
 */
export async function remove(id) {
    let countBefore = database.db.data.bestellung.length;
    database.db.data.bestellung = database.db.data.bestellung.filter(entry => entry.id !== parseInt(id));
    let countAfter = database.db.data.bestellung.length;

    await database.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Inhalte eines Codeschnipsels. Wenn alles in Ordnung ist,
 * passiert nichts. Wenn ein Fehler gefunden wird, wirft sie eine Exception mit einer
 * entsprechenden Fehlermeldung (z.B. "Lieferadresse fehlt").
 * 
 * @param {Object} snippet Zu prüfende Bestellung
 */
function validatebestellung(bestellung) {
    if (!bestellung.Lieferadresse) throw new Error("Lieferadresse fehlt");

}

export default {search, create, read, update, remove};