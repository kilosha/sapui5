sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "../model/Constants",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, UIComponent, mobileLibrary,MessageBox, MessageToast, Constants, Sorter, Filter, FilterOperator) {
	"use strict";

	// shortcut for sap.m.URLHelper
	const URLHelper = mobileLibrary.URLHelper;

	return Controller.extend("ns.bookshop.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },


        onDeleteBookButtonPress: async function(oEvent) {
            const oCtx = oEvent.getSource().getBindingContext();
            const oODataModel = this.getModel();
            const sKey = oODataModel.createKey("/Books", oCtx.getObject());
            const sBookID = oCtx.getObject("ID");
            const aBooksInOrder = this.getModel('orderModel').getProperty('/booksInOrder');
            const iIndex = aBooksInOrder.findIndex(oBook => oBook.ID === sBookID);
           
            MessageBox.confirm(`Are you sure want to delete '${oCtx.getObject().title}'? `, {
                onClose: (sAction) => {
                    if (sAction === "OK") {
                        if (iIndex !== -1) {
                            aBooksInOrder.splice(iIndex,1);
                            this.updateTotalCost();
                        }

                        this._deleteBook(sKey,sBookID);
                    }
                }
            });
        },

        

        _deleteBook: async function (sKey, sBookID) {
            const oODataModel = this.getModel();

            await oODataModel.remove(sKey, {
                success: function () {
                    MessageToast.show("Book was successfully removed!");
                },
                error: function () {
                    MessageBox.error("Error while removing book!");
                }
            }) 
        
            const aFilters =  [
                new Filter({
                    path: 'book_ID',
                    operator: FilterOperator.EQ,
                    value1: sBookID
                })
            ]
            
            const oData = await this._readP("/Orders_items", aFilters);

            this._deleteOrders(oData);
            
            if (!this.getView().getViewName().endsWith('Worklist')) {
                this.getRouter().navTo("worklist");
            }
        },

        _readP: function (sPath, aFilters) {
            const oODataModel = this.getModel();

            return new Promise ( (res,rej) => {
                oODataModel.read(sPath, 
                    {
                        success: function (response) {
                            res(response);
                        },

                        filters:  aFilters,
                        
                        error: function (error) {
                            rej(error);
                        } 
                    }
                );
            })
        },

        _deleteOrders: function (oData) {
            const oODataModel = this.getModel();

            oData.results.forEach(item => {
                oODataModel.remove(`/Orders(${item.up__ID})`,
                    {
                        error: function () {
                            MessageBox.error("Error while removing orders!");
                        } 
                    });
            })
        },

        _sortTable: function (oModel, sSortField, sTableId) {
            const aSortTypes = this.getView().getModel(oModel).getProperty('/sortTypes');
			const oItemsBinding = this.byId(sTableId).getBinding("items");

			// get current sorting type
			let sSortType = this.getView().getModel(oModel).getProperty(`/sortTypes/${sSortField}`);
			for (let key in aSortTypes) {
				aSortTypes[key] = Constants.SORT_NONE;
			}	
			
			// a bit of logic, how the types should replace each other
			switch (sSortType) {
				case Constants.SORT_NONE: {	
					sSortType = Constants.SORT_ASC;
					break;
				}
				case Constants.SORT_ASC: {
					sSortType = Constants.SORT_DESC;
					break;
				}
				case Constants.SORT_DESC: {
					sSortType = Constants.SORT_NONE;
					break;
				}
			}

			// update the models' property with new sorting type
			this.getView().getModel(oModel).setProperty(`/sortTypes/${sSortField}`, sSortType);

			if (sSortType) {
				const bSortDesc = sSortType === Constants.SORT_DESC;
				const oSorter = new Sorter(sSortField, bSortDesc);
				oItemsBinding.sort(oSorter);
			} else {
                const oSorter = new Sorter("title", false);
				oItemsBinding.sort(oSorter);			
            }
        },
        
        onValidateCreateAuthorFieldGroup: function (oEvent) {
            let bValid = true;
            const aFieldGroup = this.getView().getControlsByFieldGroupId("createAuthor");

            const aInputs = aFieldGroup.filter(oInput=> oInput.sParentAggregationName === "fields");

            aInputs.forEach( oInput => {
                if (oInput.isA('sap.m.ComboBox')) {
                    this.validateComboBox(oInput)? true: bValid = false;
                } else if (!oInput.getValue()) {
                    oInput.setValueState("Error");
                    bValid = false;
                } else {
                    oInput.setValueState("None");
                }
            });

            return bValid;
        },

        onSubmitCreateAuthorButtonPress: function (oEvent) {
            const oFormModel = this.getModel();
            const oCreateAuthorDialog = oEvent.getSource().getParent();
            const bIsValid = this.onValidateCreateAuthorFieldGroup();
            
            if (bIsValid) {
                oFormModel.submitChanges(
                    {
                        groupId: "author"
                    }
                );
                oCreateAuthorDialog.close();
                console.log(oFormModel);
            } else {
                MessageToast.show(this.getResourceBundle().getText('fillRequiredFieldsMessageToast'));
            }
        },

        onCancelCreateDialogButtonPress: function (oEvent) {
            oEvent.getSource().getParent().close();
		},

        onAddNewAuthorButtonPress: function () {
            const oView = this.getView();
            const oModel = oView.getModel();
            const that = this;

            // create an entry of the Authors collection with the specified properties and values
 
			const oContext = oModel.createEntry("/Authors", { 
                groupId: "author",
                properties: {countryOfBirth: Constants.COUNTRY}
            });

            // create dialog lazily
            if (!this.pCreateAuthorDialog) {
                this.pCreateAuthorDialog = this.loadFragment({
                    name: "ns.bookshop.view.fragments.CreateAuthorDialog"
                });
            }
                                
            this.pCreateAuthorDialog.then(function(oDialog) {
                oDialog.setBindingContext(oContext);
                oDialog.open();
            });
        },

        _resetModelChanges: function (oEvent) {
            const oDialog = oEvent.getSource();
            const oFormModel = this.getModel();
            const oContext = oDialog.getBindingContext();

            oFormModel.resetChanges([oContext.getPath()],undefined, true);
        },


        updateTotalCost: function () {
            const oWorklistModel = this.getModel("orderModel");
            const aBooksInOrder = oWorklistModel.getProperty(`/booksInOrder`);
            const fTotalBooksInOrderCost = +(aBooksInOrder.reduce((sum, oBook) => sum + +oBook.totalPrice, 0).toFixed(2));
            const fTotalBooksInOrderAmount = +(aBooksInOrder.reduce((sum, oBook) => sum + +oBook.amount, 0).toFixed(2));
        
            oWorklistModel.setProperty('/totalCost', fTotalBooksInOrderCost);
            oWorklistModel.setProperty('/totalBooksInOrderAmount',             fTotalBooksInOrderAmount);
        },

        handleComboBoxChangeValue: function (oEvent) {
            const oValidatedComboBox = oEvent.getSource();

            this.validateComboBox(oValidatedComboBox);
			
        },

        validateComboBox: function (oValidatedComboBox) {
            const sSelectedKey = oValidatedComboBox.getSelectedKey();

            if (!sSelectedKey) {
				oValidatedComboBox.setValueState("Error");
				oValidatedComboBox.setValueStateText(this.getResourceBundle().getText("createAuthorDialogComboBoxValidation"));
                return false;
			} else {
				oValidatedComboBox.setValueState("None");
                return true;
			}
        },

        onPriceChangeInputValueEvent: function (oEvent) {
            const oInput = oEvent.getSource();
            const sInputValue = oInput.getValue();

            if (+sInputValue) {
                const formattedInputValue = (+sInputValue).toFixed(2); 
                oInput.setValue(formattedInputValue);
            } else if (sInputValue.includes(",")) {
                const aInputValue = sInputValue.split("");
                const sFormattedInputValue = +aInputValue.filter(item => item !== ",").join("");
                if (!isNaN(sFormattedInputValue)){
                    oInput.setValue(sFormattedInputValue.toFixed(2));
                }
            }
        }
    });
});