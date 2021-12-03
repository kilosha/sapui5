sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
    "../model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "../model/Constants"
], function (BaseController, JSONModel, History, formatter, MessageToast, MessageBox, Constants) {
	"use strict";

	return BaseController.extend("ns.bookshop.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page shows busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			const oViewModel = new JSONModel({
                    orderslistTableTitle : this.getResourceBundle().getText("orderslistTableTitle"),
                    shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
                    tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					busy : false,
                    delay : 0,
                    edit: false,
                    required: false,
                    sortTypes: {
                        "deliveryDate": Constants.SORT_NONE,
                        "customerName": Constants.SORT_NONE,
                        "customerCity": Constants.SORT_NONE,
                        "paymentMethod": Constants.SORT_NONE,
                        "price": Constants.SORT_NONE,
                        "stock": Constants.SORT_NONE,
                        "rating": Constants.SORT_NONE
				    }
			});
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
            

            // set message model
			const oMessageManager = sap.ui.getCore().getMessageManager();
            this.setModel(oMessageManager.getMessageModel(), "message");
            oMessageManager.registerObject(this.getView(), true);


            this._formFragments = {};

			// Set the initial form to be the display one
            this._showFormFragment("DisplayBookMode");
            

		},
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */


		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack : function() {
			const sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				// eslint-disable-next-line sap-no-history-manipulation
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			const sObjectId =  oEvent.getParameter("arguments").objectId;
			this._bindView("/Books" + sObjectId);
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView : function (sObjectPath) {
			const oViewModel = this.getModel("objectView");
			this.getView().bindElement({
                path: sObjectPath,
                parameters: {expand: 'author'},
				events: {
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
            });
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished : function (oEvent) {
			// update the worklist's object counter after the table update
			let sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("orderslistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("orderslistTableTitle");
			}
            this.getModel("objectView").setProperty("/orderslistTableTitle", sTitle);
        },
        
        onNavToBookStore: function () {
            if (this.getModel("objectView").getProperty('/edit')) {
                MessageBox.confirm(`Are you sure want to leave this page? All unsaved changes will be lost`, {
                    onClose: (oAction) => {
                        if (oAction === "OK") {
                            this.onCancelBookEditChangesButtonPress();
                            this.getRouter().navTo("worklist");
                        }
                    }
                });     
            } else {
               this.getRouter().navTo("worklist");
            }
        },

        onEditBookButtonPress: function() {
            this._toggleButtonsAndView(true);
        },

        onCancelBookEditChangesButtonPress: function() {
            //Restore the data
            this.getModel().resetChanges();
            
            this._toggleButtonsAndView(false);
        },

        _getFormFragment: function (sFragmentName) {
			let pFormFragment = this._formFragments[sFragmentName];
         
			if (!pFormFragment) {

                pFormFragment = this.loadFragment({
                    name: "ns.bookshop.view.fragments." + sFragmentName
                });
				this._formFragments[sFragmentName] = pFormFragment;
			}

			return pFormFragment;
		},


        _showFormFragment : function (sFragmentName) {
            const oForm = this.byId("bookInfoForm");

			oForm.removeAllContent();
			this._getFormFragment(sFragmentName).then(function(oVBox){
                oForm.addContent(oVBox);
			})
        },
        

        _toggleButtonsAndView : function (bEdit) {
			const oViewModel = this.getModel('objectView');

			// Show the appropriate action buttons
            oViewModel.setProperty("/edit", bEdit)
            oViewModel.setProperty("/required", bEdit)

			// Set the right form type
			this._showFormFragment(bEdit ? "EditBookMode" : "DisplayBookMode");
        },
        

        onSaveBookEditChangesButtonPress: function () {

            if (this.onValidateEditBookFieldGroup()) {
                this.getModel().submitChanges();
                this._toggleButtonsAndView(false);
            } else {
			    MessageToast.show("Please, fill all the required (*) fields!");
            }
        },
        
        onValidateEditBookFieldGroup: function () {
            let bValid = true;
            const aFieldGroup = this.getView().getControlsByFieldGroupId("editBookString");

            const aInputs = aFieldGroup.filter(oInput=> oInput.sParentAggregationName === "fields");
            aInputs.push(this.byId("bookTitleEdit"));

            const aFieldGroupNumbers = this.getView().getControlsByFieldGroupId("editBook").filter(oInput=> oInput.sParentAggregationName === "fields");
            
            if (this.byId("bookRatingEdit").getValue() < 1) {
                bValid = false;
            }

            aFieldGroupNumbers.forEach(oInput => {
                if (!oInput.getValue()) {
                    oInput.setValueState("Error")
                } 

                if (oInput.getValueState() != "None") {
                    bValid = false;
                }
            })

            aInputs.forEach(oInput => {
                try {
                    oInput.getBinding("value").getType().validateValue(oInput.getValue());
                    oInput.setValueState("None");
			    } catch (oException) {
                    oInput.setValueState("Error");
			    }

                if (oInput.getValueState() != "None") {
                    bValid = false;
                }
            })

            return bValid;
        },
	});

});