import database from "../database.js";

/**
 * Kunde suchen anhand beliebiger Suchbegriffe. Es werden alle Kunden
 * ermittelt, die den gesuchten Suchbegriff in einem ihrer Textfelder enthalten.
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Kunden
 */
export async function search(query) {
    let result = database.db.data.kunde;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.KundenNR.toLowerCase().includes(query)
                || entry.Name.toLowerCase().includes(query);
        });
    }

    return result;
}

/**
 * Anlegen eines neuen Kundens.
 * 
 * @param {Object} snippet Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten
 */
export async function create(kunde) {
    if (!kunde) return;

    let entry = {
        id:       database.getNextId(database.db.data.kunde),
        KundenNR:  kunde.KundenNR,
        Name: `${kunde.Name || ""}`.trim(),
    };

    validatekunde(entry);
    database.db.data.kunde.push(entry);
    await database.db.write();

    return entry;
}

/**
 * Auslesen eines Kundens anhand seiner ID.
 * 
 * @param {integer} id Kunden ID
 * @returns {Promise<Object>} Kunde oder undefined
 */
export async function read(id) {
    let index = database.findIndex(database.db.data.kunde, parseInt(id));
    if (index >= 0) return database.db.data.kunde[index];
}

/**
 * Aktualisieren eines Kundens durch Überschreiben einzelner Felder
 * oder des gesamten Kunden-Objekts.
 * 
 * @param {integer} id Kunden ID
 * @param {Object} snippet Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten oder undefined
 */
export async function update(id, kunde) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (kunde.KundenNR) existing.KundenNR = kunde.KundenNR;
    if (kunde.Name) existing.Name = `${kunde.Name || ""}`.trim();

    validatekunde(existing);
    await database.db.write();

    return existing;
}

/**
 * Löschen eines Kundens anhand seiner ID.
 * 
 * @param {integer} id Kunden ID
 * @returns {Promise<integer>} Anzahl der gelöschten Datensätze
 */
export async function remove(id) {
    let countBefore = database.db.data.kunde.length;
    database.db.data.kunde = database.db.data.kunde.filter(entry => entry.id !== parseInt(id));
    let countAfter = database.db.data.kunde.length;

    await database.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Inhalte eines Kunden#s. Wenn alles in Ordnung ist,
 * passiert nichts. Wenn ein Fehler gefunden wird, wirft sie eine Exception mit einer
 * entsprechenden Fehlermeldung (z.B. "Name fehlt").
 * 
 * @param {Object} snippet Zu prüfender Kunde
 */
function validatekunde(kunde) {
    if (!kunde.Name) throw new Error("Name fehlt");

}

export default {search, create, read, update, remove};