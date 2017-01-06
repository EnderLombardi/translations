"use strict";

jQuery.sap.declare("airbus.mes.resourcepool.util.keyboardResourcepoolManager");

airbus.mes.resourcepool.keyboardResourcepoolManager = {

    //active spinner
    hideKeyboard: function (searchDiv) {
        if (searchDiv && document.activeElement) {
            searchDiv.onsapenter = (function (oEvt) { //onsapenter is a function when ENTER key is touched
                //lose focus on the active element so hide keyboard
                document.activeElement.blur();
            });
        }
    },

}