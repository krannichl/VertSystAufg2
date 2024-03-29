import {JSONFilePreset} from "lowdb/node";

// Default-Daten für die WebShop Datenbank
const defaultData = {
    kunde: [
        {id: 1,"KundenNR": 1234, "Name":"Lucas Krannich" },
        {id: 2,"KundenNR": 4711, "Name":"Max Mustermann"},
        {id: 3,"KundenNR": 5180, "Name":"Jack Daniels"},
    ],

    bestellung: [
        {id: 1, "BestellNR": 1234, "Lieferadresse":"Krannichstraße 1" },
        {id: 2, "BestellNR": 4711, "Lieferadresse":"Musterstraße 1"},
        {id: 3, "BestellNR": 5180, "Lieferadresse":"Tennessee Allee 1"},
    ],
    produkt: [
        {id: 1, "ProduktNR": 1234, "Preis": 1.00 },
        {id: 2, "ProduktNR": 4711, "Preis": 1.99},
        {id: 3, "ProduktNR": 5180, "Preis": 500.55},
    ],
};

// Datenbank-Objekt als Singleton
export const db = await JSONFilePreset("db.json", defaultData);

/**
 * Hilfsmethode zum Auffinden des Array-Index eines Datensatzes, dessen ID bekannt ist.
 * Hierfür muss der Methode im ersten Parameter das zu durchsuchende Array und im
 * zweiten Parameter die ID des gesuchten Datensatzes übergeben werden. Als Ergebnis
 * liefert sie den Index innerhalb des Arrays oder -1, wenn dieser nicht gefunden wurde.
 * 
 * @param {Object[]} dataset Zu durchsuchende Datenmenge
 * @param {integer} id ID des gesuchten Datensatzes
 * @returns {integer} Gefundener Index oder -1
 */
export function findIndex(dataset, id) {
    return dataset.findIndex(entry => entry.id === id);
}

/**
 * Hilfsmethode zum Ermitteln der nächsten freien ID innerhalb einer Datenmenge.
 * Kann beim Speichern eines neuen Datensatzes verwendet werden, um die ID des
 * Datensatzes zu ermitteln.
 * 
 * HINWEIS: Da wir keine echte Datenbank nutzen, müssen wir auf diese Hilfsmethode
 * zurückgreifen, die allerdings keinerlei Synchronisation erzwingt und somit bei
 * zeitgleichen Zugriffen durch mehrere Clients zu falschen Ergebnissen führen kann!
 * 
 * @param {Object[]} dataset Zu durchsuchende Datenmenge
 */
export function getNextId(dataset) {
    let maxId = -1;
    for (let entry of dataset || []) maxId = Math.max(maxId, entry.id);
    return maxId + 1;
}

export default {db, findIndex, getNextId};