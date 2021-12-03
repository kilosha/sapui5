sap.ui.define([
    "sap/m/MessageBox",
    "./CustomController.controller"
],  function(MessageBox, CustomController) {
    "use strict";

    async function getRate() {
        const response = await fetch('https://www.nbrb.by/api/exrates/rates/431');
        const commits = await response.json();
        return commits.Cur_OfficialRate;
    }
    

   
    return {
        buttonPressed: function(oEvent) {
            const oBook = oEvent.getSource().getParent().getBindingContext().getObject();
            
            //CustomController.prototype.openCurrencyPopover(oEvent);
            getRate().then(res=> MessageBox.show(`${(oBook.price*res).toFixed(2)} BYN`));

        }
    };
});