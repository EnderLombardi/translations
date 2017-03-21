sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "airbus/mes/poc/p13n/model/formatter"
], function (Controller, formatter) {
    "use strict";

    return Controller.extend("airbus.mes.poc.p13n.controller.TableTranslate", {

        formatter: formatter,

        onInit: function () {

        },

        onItemCreated: function (id, context) {

            var alert = this.formatter.alertData(context.getProperty('data'));

            var oTemplate = new sap.ui.core.Item({
                selectedKey: context.getProperty('name'),
                text: context.getProperty('name') + alert
            });

            return oTemplate;

        },

        onSelect: function (oEvent) {
            var sValue = oEvent.mParameters.value;
            if (oEvent.mParameters.value.substr(sValue.length - 4, sValue.length) === ' [X]') {
                sValue = oEvent.mParameters.value.substr(0, sValue.length - 4);
            }
            var oData = this.getView().getModel('myFillCombobox').getData();
            oData = oData.Row.filter(x => x.name === sValue);
            var oModel = this.getView().getModel('myTable');
            oModel.setData(oData[0]);

        },
        
        onExportPress: function (oEvent) {
            try{
                var aRow = this.getView().getModel('myFillCombobox').getData().Row; 
                var CSV ="";
                for (var j = 0; j <aRow.length; j++) {
                    //loop is to extract each row
                    for (var i = 0; i < aRow[j].data.length; i++) {
                        var csvRow = "";
                        var aData = JSON.stringify(aRow[j].data[i]).replace(/['"{}]+/g, '').split(',');
                        var sData = "";
                        var sHeaderData = "";
                        for (var k = 0; k < aData.length; k++) {
                            if(k>0) sData += ";";
                            aData[k] = aData[k].split(':');
                            if(j==0 && i == 0){ //define fieldnames
                                sHeaderData += ";" + aData[k][0];
                            }
                            sData += aData[k][1];
                        }
                        if(j==0 && i == 0){ //add header line to start file
                            sHeaderData = "Component" + sHeaderData //first fieldname
                            sHeaderData.slice(0,sHeaderData.length - 1);
                            CSV+= sHeaderData + "\r\n";
                        }
                        //add data line
                        csvRow+= aRow[j].name + ";" + sData;
                        csvRow.slice(0,csvRow.length - 1);
                        CSV+= csvRow + "\r\n";
                    }
                }
                // When CSV data are generated do the exportation to file  
                if (CSV.length > 0){
                    var link =document.createElement("a");
                    link.href = "data:text/csv;charset=utf-8," + escape(CSV);;
                    link.style = "visibility:hidden";
                    link.download ="export.csv";
                    link.click();
                }
                else{
                    alert("Sorry,no data to export!");
                }
            }
            catch(error){
                alert("Error to export data: " + error);
            }
       }
    });
});