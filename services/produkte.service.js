import database from "../database.js";

/**
 * Produkte suchen anhand beliebiger Suchbegriffe. Es werden alle Produkte
 * ermittelt, die den gesuchten Suchbegriff in einem ihrer Textfelder enthalten.
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Produkte
 */
export async function search(query) {
    let result = database.db.data.produkt;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.ProduktNR.toLowerCase().includes(query)
                || entry.Preis.toLowerCase().includes(query);
        });
    }

    return result;
}

/**
 * Anlegen eines neuen Produktes.
 * 
 * @param {Object} snippet Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten
 */
export async function create(produkt) {
    if (!produkt) return;

    let entry = {
        id:       database.getNextId(database.db.data.produkt),
        ProduktNR: produkt.ProduktNR,
        Preis: produkt.Preis,
    };

    validateprodukt(entry);
    database.db.data.produkt.push(entry);
    await database.db.write();

    return entry;
}

/**
 * Auslesen eines Produktes anhand seiner ID.
 * 
 * @param {integer} id Produkt ID
 * @returns {Promise<Object>} Produkt oder undefined
 */
export async function read(id) {
    let index = database.findIndex(database.db.data.produkt, parseInt(id));
    if (index >= 0) return database.db.data.produkt[index];
}

/**
 * Aktualisieren eines Produktes durch Überschreiben einzelner Felder
 * oder des gesamten Produkte-Objekts.
 * 
 * @param {integer} id Produkte ID
 * @param {Object} snippet Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten oder undefined
 */
export async function update(id, produkt) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (produkt.ProduktNR) existing.ProduktNR = produkt.ProduktNR;
    if (produkt.Preis) existing.Preis = `${produkt.Preis || ""}`.trim(),

    validateprodukt(existing);
    await database.db.write();

    return existing;
}

/**
 * Löschen eines Produktes anhand seiner ID.
 * 
 * @param {integer} id Produkte ID
 * @returns {Promise<integer>} Anzahl der gelöschten Datensätze
 */
export async function remove(id) {
    let countBefore = database.db.data.produkt.length;
    database.db.data.produkt = database.db.data.produkt.filter(entry => entry.id !== parseInt(id));
    let countAfter = database.db.data.produkt.length;

    await database.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Inhalte eines Produktes. Wenn alles in Ordnung ist,
 * passiert nichts. Wenn ein Fehler gefunden wird, wirft sie eine Exception mit einer
 * entsprechenden Fehlermeldung (z.B. "Preis fehlt").
 * 
 * @param {Object} snippet Zu prüfender Produkte
 */
function validateprodukt(produkt) {
    if (!produkt.Preis) throw new Error("Preis fehlt");

}

export default {search, create, read, update, remove};