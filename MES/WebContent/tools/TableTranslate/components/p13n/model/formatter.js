sap.ui.define([], function () {
    "use strict";
    return {

        // Function: Allow to add color class to Object Template. Output: Object.
        alertData: function (sValue) {

            // Get Data
            var oData = this.getView().getModel('myFillCombobox').getData();
            var sAlert = sValue;

            //Find Object
            var oData = oData.Row.filter(x => x.name === sValue);

            //Check if one value in empty
            var aData = oData[0].data;
            var i = 0, nLength = aData.length, bFound = false;
            while (i < nLength && bFound == false) {
                if (aData[i].en.length === 0 || aData[i].fr.length === 0 || aData[i].sp.length === 0 || aData[i].de.length === 0) {
                    bFound = true;
                }
                i++;
            }

            if (bFound === true) {
                var sAlert = sValue + ' [X]';
            }
            return sAlert;
        }
    };
});