sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {

        // Form Data
        createJsonFillComboboxModel: function () {

            var oLocal = {
                "Row":
                [{
                    "name": "acpnglinkg", "data":
                    [
                        { "id": "firstname", "fr": "prénom", "en": "firstname", "sp": "pila", "de": "rzerze" },
                        { "id": "lastname", "fr": "nom", "en": "", "sp": "appellido", "de": "" },
                        { "id": "address", "fr": "adresse", "en": "", "sp": "", "de": "" },
                        { "id": "hello", "fr": "bonjour", "en": "hello", "sp": "hola", "de": "gutentag" },
                        { "id": "world", "fr": "monde", "en": "world", "sp": "mundo", "de": "" },
                    ]
                },
                {
                    "name": "disruption", "data":
                    [
                        { "id": "call", "fr": "appel", "en": "call", "sp": "llamar", "de": "anruf" },
                        { "id": "number", "fr": "nombre", "en": "number", "sp": "nombre", "de": "fdsfs" },
                        { "id": "door", "fr": "porte", "en": "door", "sp": "puerta", "de": "fsdsf" },
                        { "id": "hello", "fr": "bonjour", "en": "hello", "sp": "hola", "de": "gutentag" },
                        { "id": "world", "fr": "monde", "en": "world", "sp": "mundo", "de": "sdfsdf" },
                    ]
                },
                ]
            };

            var oModel = new JSONModel();
            oModel.setData(oLocal);
            return oModel;
        },

        createJsonTableModel: function () {
            var oModel = new JSONModel();
            return oModel;
        },

        // Fill Combobox with Data
        createJsonAllTableModel: function () {
            var oModel = new JSONModel();
            oModel.loadData("https://dmiswde0.eu.airbus.corp/XMII/Illuminator?service=DynamicQuery&server=SAPMEWIP&mode=TableList&content-type=text/json&j_user=S00DB44&j_password=start102", true);
            oModel.setSizeLimit(2000)
            return oModel;
        },

    };
});