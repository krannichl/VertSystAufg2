import service     from "../services/bestellung.service.js";
import {wrapAsync} from "../utils.js";
import {logger}    from "../utils.js";

const prefix = "/bestellung";

/**
 * Diese Funktion fügt die unten ausprogrammierten Route Handler der
 * Express Application hinzu.
 *
 * @param {Express.Application} app Express Application
 */
export default function registerRoutes(app) {
    // Ganze Collection
    app.get(prefix, wrapAsync(search));
    app.post(prefix, wrapAsync(create));

    // Einzelne Ressource
    app.get(`${prefix}/:id`, wrapAsync(read));
    app.put(`${prefix}/:id`, wrapAsync(update));
    app.patch(`${prefix}/:id`, wrapAsync(update));
    app.delete(`${prefix}/:id`, wrapAsync(remove));
};

/**
 * Abruf einer Liste von bestellungen, optional mit Stichwortsuche.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function search(req, res) {
    let result = [];
    let bestellungen = await service.search(req.query.q);

    for (let bestellung of bestellungen || []) {
        result.push({
            id:             bestellung.id,
            BestellNR:       bestellung.BestellNR,
        });
    }

    res.status(200);
    res.send(result);
}

/**
 * Anlegen einer neuen Bestellung.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function create(req, res) {
    try {
        let result = await service.create(req.body);

        res.status(201);
        res.header("location", `${prefix}/${result.id}`);
        res.send(result);
    } catch (error) {
        logger.error(error);

        res.status(400);

        res.send({
            name:    error.name    || "Error",
            message: error.message || "",
        });
    }
}

/**
 * Abruf einer einzelnen Bestellung anhand ihrer ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function read(req, res) {
    try {
        let result = await service.read(req.params.id);

        if (result) {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);
            res.send({
                error:   "NOT-FOUND",
                message: "Die Bestellung wurde nicht gefunden."
            });
        }
    } catch (error) {
        logger.error(error);
        
        res.status(400);
        res.send({
            name:    error.name    || "Error",
            message: error.message || "",
        });
    }
}

/**
 * Aktualisieren einzelner Felder einer Bestellung oder Überschreiben der
 * gesamten Bestellung.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function update(req, res) {
    try {
        let result = await service.update(req.params.id, req.body);

        if (result) {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);

            res.send({
                error:   "NOT-FOUND",
                message: "Diese Bestellung wurde nicht gefunden."
            });
        }
    } catch (error) {
        logger.error(error);
        
        res.status(400);

        res.send({
            name:    error.name    || "Error",
            message: error.message || "",
        });
    }
}

/**
 * Löschen einer Bestellung anhand seiner ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function remove(req, res) {
    let count = await service.remove(req.params.id);

    if (count > 0) {
        res.status(204);
        res.send();
    } else {
        res.status(404);

        res.send({
            error:   "NOT-FOUND",
            message: "Diese Bestellung wurde nicht gefunden."
        });
    }
}
