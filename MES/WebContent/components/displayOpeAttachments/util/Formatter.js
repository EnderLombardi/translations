"use strict";


airbus.mes.displayOpeAttachments.util.Formatter = {

    /* *********************************************************************** *
	 *  FORMAT DOCUMENTS DATA                                           	   *
	 * *********************************************************************** */

    //create dokar, dokarOrDoknr & doktl using workInstruction
    extractWorkinstruction: function (row) {
        for (var i = 0; i < row.length; i += 1) {
            row[i].dokar = row[i].workInstruction.split("/")[0];//needed to sort
            row[i].dokarOrDoknr = row[i].workInstruction.split("/")[1];//field that will contain dokar or doknr in the tree table
            row[i].doktl = row[i].workInstruction.split("/")[2];
            row[i].description = row[i].descriptionWI;//we create one attribute description for both description of doc type and document
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

        //create docType & docTypeDesc, arrays with different values of dokarOrDoknr & doc type description
        var flags = [], docType = [], docTypeDesc = [], changeDocumentTypeArray = [];
        for (var i = 0; i < row.length; i++) {
            if (flags[row[i].dokar]) continue;
            flags[row[i].dokar] = true;
            docType.push(row[i].dokar);
            docTypeDesc.push(row[i].docTypeDescription);
            changeDocumentTypeArray.push(i);//index of the change of doc type (in the array sorted by doc type)
        }


        //create a new Row to have the good format 
        var newRow = [];
        var nbOfDoc = 0;
        var documentLabel;

        for (var j = 0; j < docType.length; j++) { //for each doc type we will create an object

            //we need to calculate the number of each document for each doc type to display it
            if (j !== docType.length - 1) {
                nbOfDoc = changeDocumentTypeArray[j + 1] - changeDocumentTypeArray[j];//difference between next value of change and actual
            } else {
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
                dokarOrDoknr: docType[j] + " : " + nbOfDoc + " " + documentLabel,
                description: docTypeDesc[j],
                documents: [] //array that will contain the several informations for each document
            };

            newRow.push(obj);
        }

        //we need now to push each documents at the right place in newRow
        var index = 0;
        for (var k = 0; k < row.length; k++) {
            newRow[index].documents.push(row[k]);
            if (k + 1 === changeDocumentTypeArray[index + 1]) { //check if we have to change of object filled
                index++;
            }
        }

        return newRow;
    },

    addDocTypesDescriptions: function (row, docTypesRow) {
        if (docTypesRow) {
            for (var i = 0; i < row.length; i++) {
                var j = 0;

                var langage = sap.ui.getCore().getConfiguration().getLanguage();
                while (j !== docTypesRow.length && row[i].description === undefined) {
                    if (row[i].dokarOrDoknr.split(" ")[0] === docTypesRow[j].ERP_DOC_TYPE) {
                        switch (langage) {
                            case "en":
                                row[i].description = docTypesRow[j].Description_EN;
                                break;
                            case "fr":
                                row[i].description = docTypesRow[j].Description_FR;
                                break;
                            case "de":
                                row[i].description = docTypesRow[j].Description_DE;
                                break;
                            case "es":
                                row[i].description = docTypesRow[j].Description_ES;
                                break;
                            default://english
                                row[i].description = docTypesRow[j].Description_EN;
                                break;
                        }
                    }
                    j++;
                }
            }
        }
    },

    /* *********************************************************************** *
	 *  FILTER OLD VERSIONS                                              	   *
	 * *********************************************************************** */

    //remove the oldest versions of a same document
    removeOldVersions: function (row) {
        this.unique(row, this.documentsCompareFunc);
    },

    //a is an array of object
    unique: function (a, documentsCompareFunc) {
        var x;
        for (var h = 0; h < a.length; h++) {//for each document type
            a[h].documents.sort(documentsCompareFunc);//we sort the documents
            for (var i = 1; i < a[h].documents.length;) {//and compare them
                x = documentsCompareFunc(a[h].documents[i - 1], a[h].documents[i]);//-1, 1 or 0
                if (x !== 0) {
                    i++;
                } else {//we remove the one with the oldest version
                    if (a[h].documents[i - 1].revision.toUpperCase() < a[h].documents[i].revision.toUpperCase()) {
                        a[h].documents.splice(i - 1, 1);
                    } else {
                        a[h].documents.splice(i, 1);
                    }
                    a[h].dokarOrDoknr = a[h].dokarOrDoknr.replace(/\d+/g, function (a) { return a - 1; }); //decrement nb of documents
                }
            }
        }
        return a;
    },

    //based on dokarOrDoknr then doc_part
    documentsCompareFunc: function (eltA, eltB) {
        if (eltA.dokarOrDoknr.toUpperCase() < eltB.dokarOrDoknr.toUpperCase()) {
            return -1;
        } else if (eltA.dokarOrDoknr.toUpperCase() > eltB.dokarOrDoknr.toUpperCase()) {
            return 1;
        } else {
            if (eltA.doktl.toUpperCase() < eltB.doktl.toUpperCase()) {
                return -1;
            } else if (eltA.doktl.toUpperCase() > eltB.doktl.toUpperCase()) {
                return 1;
            } else {
                return 0;
            }
        }
    },

    /* *********************************************************************** *
	 *  ICONS                                          	                       *
	 * *********************************************************************** */

    showHideAnnotate:function(annotate) {
        if (annotate == "true") {
            return true;
        } else {
            return false;
        }
    }
};

