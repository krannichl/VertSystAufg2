import service     from "../services/produkte.service.js";
import {wrapAsync} from "../utils.js";
import {logger}    from "../utils.js";

const prefix = "/produkt";

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
 * Abruf einer Liste von Produkten, optional mit Stichwortsuche.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function search(req, res) {
    let result = [];
    let produkte = await service.search(req.query.q);

    for (let produkt of produkte || []) {
        result.push({
            id: produkt.id,
            ProduktNR: produkt.ProduktNR,
        });
    }

    res.status(200);
    res.send(result);
}

/**
 * Anlegen eines neuen Produkts.
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
 * Abruf eines einzelnen Produkts anhand seiner ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function read(req, res) {
    let result = await service.read(req.params.id);

    if (result) {
        res.status(200);
        res.send(result);
    } else {
        logger.error(error);

        res.status(404);

        res.send({
            error:   "NOT-FOUND",
            message: "Das Produkt wurde nicht gefunden."
        });
    }
}

/**
 * Aktualisieren einzelner Felder eines Produkts oder Überschreiben des
 * gesamten Produkts.
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
                message: "Das Produkt wurde nicht gefunden."
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
 * Löschen eines Codeschnipsels anhand seiner ID.
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
            message: "Das Produkt wurde nicht gefunden."
        });
    }
}
