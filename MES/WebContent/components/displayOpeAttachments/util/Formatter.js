"use strict";


airbus.mes.displayOpeAttachments.util.Formatter = {

    //create dokar, doknr & doktl using workInstruction
    extractWorkinstruction: function (row) {
        for (var i = 0; i < row.length; i += 1) {
            row[i].dokar = row[i].workInstruction.split("-")[0];
            row[i].doknr = row[i].workInstruction.split("-")[1];
            row[i].doktl = row[i].workInstruction.split("-")[2];
        }
    },

    //sort the documents by doc type
    sortByDocType: function (row) {
        row.sort(function (a, b) {
            var nameA = a.dokar.toUpperCase(); // ignore upper and lowercase
            var nameB = b.dokar.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
    },

    addDocTypeHierarchy: function (row) {

        //create docType & docTypeDesc, arrays with different values of dokar & doc type description
        var flags = [], docType = [], docTypeDesc = [], changeDocumentTypeArray = [];
        for (var i = 0; i < row.length; i++) {
            if (flags[row[i].dokar]) continue;
            flags[row[i].dokar] = true;
            docType.push(row[i].dokar);
            //docTypeDesc.push(row[i].doc_type_description); TODO : get the doc type description
            changeDocumentTypeArray.push(i);//index of the change of doc type (in the array sorted by doc type)
        }


        //create a new Row to have the good format 
        var newRow = [];
        var nbOfDoc = 0;
        var documentLabel;

        for (var j = 0; j < docType.length; j++) { //for each doc type we will create an object

            //we need to calculate the number of each document for each doc type to display it
            if (j !== docType.length -1){
                nbOfDoc = changeDocumentTypeArray[j+1] - changeDocumentTypeArray[j];//difference between next value of change and actual
            } else  {
                nbOfDoc = row.length - changeDocumentTypeArray[j];//difference between last element of the array and last value of change
            }
            
            //singular/plural for number of documents
            if (nbOfDoc > 1) {
                documentLabel = airbus.mes.displayOpeAttachments.oView.getModel("i18nDisplayOpeAttachmentsModel").getProperty("documents");
            } else {
                documentLabel = airbus.mes.displayOpeAttachments.oView.getModel("i18nDisplayOpeAttachmentsModel").getProperty("document");
            }

            //we fill the object
            var obj = {
                dokar: docType[j] + " : " + nbOfDoc + " " + documentLabel,
                //doc_type_description: docTypeDesc[j], TODO : get the doc type description
                documents: [] //array that will contain the several informations for each document
            };

            newRow.push(obj);
        }

        //we need now to push each documents at the right place in newRow
        var index = 0;
        for (var k=0; k < row.length; k++) {

            row[k].dokar = ""; //we delete this value so it won't be displayed in the treetable (so the user don't see x times the same information)
            //TODO : same thing to do with document description
            newRow[index].documents.push(row[k]);

            if (k+1 === changeDocumentTypeArray[index+1]) { //check if we have to change of object filled
                index++;//
            }
        }

        return newRow;
    },

};

