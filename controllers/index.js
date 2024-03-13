import kundenController from "./kunden.controller.js";
import bestellungsController  from "./bestellung.controller.js";
import produktController  from "./produkt.controller.js";

// Reexport alle Controller, um die main.js nicht anpassen zu müssen,
// wenn künftig ein neuer Controller hinzugefügt wird.
export default [
    kundenController,
    bestellungsController,
    produktController,
];