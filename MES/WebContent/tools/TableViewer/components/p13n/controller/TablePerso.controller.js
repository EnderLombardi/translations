sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "airbus/mes/poc/p13n/model/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("airbus.mes.poc.p13n.controller.TablePerso", {

        formatter: formatter,

        onInit: function () {

        },

        // Action: Button onPress
        onPress: function () {

            // Get Data
            var oDataTable = this.getView().getModel('myTable').getData();
            var sTableName = oDataTable.name.toUpperCase();
            var nTableRows = oDataTable.rows;

            // Prepare and launch query for column
            var sColumnURL = "https://dmiswde0.eu.airbus.corp/XMII/Illuminator?service=DynamicQuery&server=SAPMEWIP&mode=Query&RowCount=50&Tables=TABLE_COLUMNS&Columns=*&FilterExpr=TABLE_NAME%20=%20%27" + sTableName + "%27&content-type=text/json&j_user=S00DB44&j_password=start102";
            var oModelMyColumn = this.getView().getModel('myColumn');
            oModelMyColumn.loadData(sColumnURL, true);

            // Prepare and launch query for row
            var sRowURL = "https://dmiswde0.eu.airbus.corp/XMII/Illuminator?service=DynamicQuery&server=SAPMEWIP&mode=Query&RowCount=" + nTableRows + "&Tables=" + sTableName + "&Columns=*&content-type=text/json&j_user=S00DB44&j_password=start102";
            var oModelMyRow = this.getView().getModel('myRow');
            oModelMyRow.loadData(sRowURL, true);
        },

        
        onItemCreated: function (id, context) {
            var oDataColumn = this.getView().getModel('myColumn').getData();
            var oColumns = oDataColumn.Rowsets.Rowset[0].Row;

            // Order column by column_id
            oColumns.sort(function (a, b) {
                return a.POSITION - b.POSITION
            })

            //Generate Template
            var oTemplate = this.formatter.generatedTemplate(context.getProperty('DATA_TYPE_NAME'), context.getProperty('COLUMN_NAME'));

            //Add CSS
            oTemplate = this.formatter.colorTemplate(oTemplate, context.getProperty('COLUMN_NAME'));

            // Tooltip display
            var sHtmlTooltip = "<ul>";
            sHtmlTooltip += "<li>DATA_TYPE_NAME: <strong>" + context.getProperty('DATA_TYPE_NAME') + "</strong></li>";
            sHtmlTooltip += "<li>LENGTH: <strong>" + context.getProperty('LENGTH') + "</strong></li>";
            sHtmlTooltip += "<li>IS_NULLABLE: <strong>" + context.getProperty('IS_NULLABLE') + "</strong></li>";
            sHtmlTooltip += "<li>DEFAULT_VALUE: <strong>" + context.getProperty('DEFAULT_VALUE') + "</strong></li>";
            sHtmlTooltip += "</ul>";

            // Column
            var oColumn = new sap.ui.table.Column({
                label: new sap.ui.commons.Label({
                    text: context.getProperty('COLUMN_NAME')
                }),
                template: oTemplate,
                sortProperty: context.getProperty('COLUMN_NAME'),
                filterProperty: context.getProperty('COLUMN_NAME'),
                width: "200px",
                tooltip: new sap.ui.commons.RichTooltip({
                    text: sHtmlTooltip,
                    title: context.getProperty('COLUMN_NAME'),
                })
            });
            return oColumn;
        }

    });
});