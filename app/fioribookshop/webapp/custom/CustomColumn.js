sap.ui.define([
    "sap/ui/core/Fragment"
],  function(Fragment) {
    "use strict";

    async function getRate() {
        const response = await fetch('https://www.nbrb.by/api/exrates/rates/431');
        const commits = await response.json();
        return commits.Cur_OfficialRate;
    }
    
  
    return {

        openDialog: async function(oEvent) {
            const JSONModel =  this.getModel("JSONModel");
            const oBook = oEvent.getSource().getParent().getBindingContext().getObject();
            const oButton = oEvent.getSource();
       
            await getRate().then(res=> JSONModel.setProperty("/currentBookPriceBYN", (oBook.price*res).toFixed(2)));
         
        

            JSONModel.setProperty("/currentBookTitle", oBook.title);

            const oBookListPage = sap.ui.getCore().byId("fb.fioribookshop::BooksList");


            if (!this.oAddReviewDialog) {
                this.oAddReviewDialog = await Fragment.load({
                    id: `${oBookListPage.getId()}-AddReviewDialog`,
                    name: "fb.fioribookshop.custom.dialogTest"
                });

                oBookListPage.addDependent(this.oAddReviewDialog);
            }
            
            this.oAddReviewDialog.openBy(oButton);
            
        }
    };
});