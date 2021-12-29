sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
    "../model/formatter",
    "../model/Constants",
	"sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "ns/bookshop/libs/moment"
], function (BaseController, JSONModel, formatter, Constants, Filter, FilterOperator,MessageToast, Fragment, MessageBox, momentjs) {
	"use strict";

	return BaseController.extend("ns.bookshop.controller.Worklist", {

        formatter: formatter,
        
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {

			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			const oViewModel = new JSONModel({
				worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
                tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
                paymentMethods: [
                    {type: "Online"}, {type: "CreditCard"}, {type: "Cash"}
                ],
                sortTypes: {
					"title": Constants.SORT_NONE,
					"author": Constants.SORT_NONE,
					"descr": Constants.SORT_NONE,
					"genre_title": Constants.SORT_NONE,
					"price": Constants.SORT_NONE,
					"stock": Constants.SORT_NONE,
					"rating": Constants.SORT_NONE
                },
                currentDay : `${moment().format('MMMM Do YYYY')} (${moment().format('dddd')})`
            });
            
            this.setModel(oViewModel, "worklistView");
            
            // set message model
			const oMessageManager = sap.ui.getCore().getMessageManager();
            this.setModel(oMessageManager.getMessageModel(), "message");
            oMessageManager.registerObject(this.getView(), true);
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
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onBooksListItemSelect : function (oEvent) {
            // The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		onSearch : async function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				let aTableSearchState = [];
                const sQuery = oEvent.getParameter("query");
                
                const aFiltersByAuthorName = await this._filterByAuthor(sQuery);

                const filter = new Filter({
                    filters: [
                        new Filter({
                            path: 'title',
                            operator: FilterOperator.Contains,
                            value1: sQuery
                        }),
                        new Filter({
                            path: 'genre_title',
                            operator: FilterOperator.Contains,
                            value1: sQuery
                        }),
                        ...aFiltersByAuthorName
                    ],
                    and:false
                })
                
				if (sQuery && sQuery.length > 0) {
					aTableSearchState = filter;
				}
				this._applySearch(aTableSearchState);
			}

        },
        
        _filterByAuthor: async function (sQuery) {
            const aFilters = [];
            const oODataModel = this.getModel();

            return new Promise ( (res,rej) => {
                oODataModel.read("/Authors", 
                    {
                        success: function (response) {
                            res(response);
                        },

                        error: function (error) {
                            rej(error);
                        } 
                    }
                );
            })
            .then(res => {
                  res.results
                    .filter(item => item.name.toUpperCase().includes(sQuery.toUpperCase()))
                    .forEach(item => aFilters.push(
                        new Filter({
                            path: "author_ID",
                            operator: FilterOperator.EQ,
                            value1: item.ID
                        })
                    ))
                    return aFilters;
                }
            )
        },

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh : function () {
			let oTable = this.byId("booksTable");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject : function (oItem) {
            
            const oCtx = oItem.getBindingContext();

			this.getRouter().navTo("object", {
				objectId: `(${oCtx.getObject("ID")})`
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			let oTable = this.byId("booksTable"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
        },
        

        onOpenCreateBookDialogButtonPress: function () {
            const oView = this.getView();
            const oModel = this.getModel();
            
            //create an entry of the Books collection with the specified properties and values
            
			const oContext = oModel.createEntry("/Books", {
                properties: { genre_title: Constants.GENRE}
            });

            if (!this.pCreateBookDialog) {
                this.pCreateBookDialog = this.loadFragment({
                    name: "ns.bookshop.view.fragments.CreateBookDialog"
                });
            }

            this.pCreateBookDialog.then(function(oDialog) {
                oView.addDependent(oDialog);
                oDialog.setBindingContext(oContext);
                oDialog.open();
            });
        },
        
		/**
		* After dialog close event handler.
        */
        
        onAfterCloseCreateBookDialog: function (oEvent) {
            this._resetModelChanges(oEvent);
            
            this._resetFieldGroupValidation("createBookString","createBook"); 
        },

        onSubmitCreateBookButtonPress: function (e) {
            const oFormModel = this.getModel();
            const oDialog = e.getSource().getParent();
            const sObjectPath = oDialog.getBindingContext().sPath;
            const sAuthorID = this.getView().byId('book-author').getSelectedItem().getKey();
           
            oFormModel.setProperty(`${sObjectPath}/author_ID`, sAuthorID);
            if (this.onValidateFieldGroup("createBook")) {
                oFormModel.submitChanges();
                oDialog.close(); 
            } else {
			    MessageToast.show(this.getResourceBundle().getText('fillRequiredFieldsMessageToast'));
            }
        },

        /**
		* After dialog close event handler.
        */
        
        onAfterCloseCreateAuthorDialog: function (oEvent) {
            this._resetModelChanges(oEvent);

            this._resetFieldGroupValidation("createAuthor");
        },


        _resetFieldGroupValidation: function(sFieldGroupId, sSecondFieldGroupId) {
            const aInputsString = this.getView().getControlsByFieldGroupId(sFieldGroupId).filter(input=> input.sParentAggregationName === "fields" || input.sParentAggregationName === "items");
            const aInputs = this.getView().getControlsByFieldGroupId(sSecondFieldGroupId).filter(input=> input.sParentAggregationName === "fields" || input.sParentAggregationName === "items");

            aInputsString.forEach(input => input.setValueState("None"));
            aInputs.forEach(input => input.setValueState("None"));
        },

        onValidateFieldGroup: function (sFieldGroupId) {
            let valid = true;
            const aFieldGroup = this.getView().getControlsByFieldGroupId(sFieldGroupId);
            const aInputs = aFieldGroup.filter(input=> input.sParentAggregationName === "fields" || input.sParentAggregationName === "items");

            aInputs.forEach(input => {
                if (!input.getValue() || input.getValueState() === "Error") {
                    input.setValueState("Error");
                    valid = false;
                } 
            })

            return valid;
        },

        onDatePickerValueChange: function (oEvent) {
            const oDatePicker = oEvent.getSource();
            if (!oDatePicker.getValue() || !oDatePicker.isValidValue())  {
                oDatePicker.setValueState("Error");
            } else {
                oDatePicker.setValueState("None");
            };
        },
 
        onPriceChangeInputValueEvent: function () {
            const inputValue = +this.getView().byId("book-price").getValue();
            if (inputValue) {
                const formattedInputValue = +inputValue.toFixed(2); 
                this.getView().byId("book-price").setValue(formattedInputValue);
            }
        },

        onInputChange: function(oEvent) {
            const oInput = oEvent.getSource();
            this._validateInput(oInput);
        },

        _validateInput: function (oInput) {
            try {
                oInput.getBinding("value").getType().validateValue(oInput.getValue());
                oInput.setValueState("None");
                return true;
            } catch (oException) {
                oInput.setValueState("Error");
                return false;
            }
        },

        onPressPlaceAnOrderButton: function () {
            const oModel = this.getModel();
            const oView = this.getView();
            const defaultPaymentMethod = this.getModel('worklistView').getProperty('/paymentMethods')[0].type;
            const createNewOrderItems = this._createNewOrderItems.bind(this);
            

            const oContext = oModel.createEntry("/Orders", {
                properties: {
                    phoneNumber: "", 
                    paymentMethod: defaultPaymentMethod,
                    currency: Constants.CURRENCY
                },
                success: function (response) {
                    createNewOrderItems(response.ID);
                }
            });

            if (!this.pCreateOrderDialog) {
                this.pCreateOrderDialog = this.loadFragment({
                    name: `ns.bookshop.view.fragments.CreateOrderDialog`
                });
            }

            this.pCreateOrderDialog.then(function(oDialog) {
                oView.addDependent(oDialog);
                oDialog.setBindingContext(oContext);
                oDialog.open();
            });
        },

        onPressNumberButton: function (oEvent) {
            const value = oEvent.getParameters().text;
            const oFormModel = this.getModel();
            const oInput = this.byId('phoneNumber');
            const sObjectPath = oInput.getBindingContext().sPath;
            const prevValue = oInput.getValue();

            if (prevValue.length < 13) {
                if (value == "") {
                oFormModel.setProperty(`${sObjectPath}/phoneNumber`, `${prevValue.slice(0,-1)}`);
                } else {
                    oFormModel.setProperty(`${sObjectPath}/phoneNumber`, `${prevValue+value}`);
                }  
            } if (prevValue.length == 13) {
                if (value == "") {
                oFormModel.setProperty(`${sObjectPath}/phoneNumber`, `${prevValue.slice(0,-1)}`);}
            }

            this._validateInput(oInput);
        },

        handleResponsivePopoverPress: function (oEvent) {
			let oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name:"ns.bookshop.view.fragments.Popover",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._pPopover.then(function(oPopover) {
				oPopover.openBy(oButton);
			});
        },
        

         /**
		 * "Sort" button press event handler.
		 */
		onSortButtonPress: function (oEvent) {
            const sSortField = oEvent.getSource().getProperty('text');

            this._sortTable("worklistView", sSortField, "booksTable");
        },
   
        orderBookAmountChange: function (oControlEvent) {
            const oStepInput = oControlEvent.getSource();
            const booksArray = this.getModel("orderModel").getProperty(`/booksInOrder`);
            const book = oStepInput.getBindingContext().getObject();
            const bookID = oStepInput.getBindingContext().getObject("ID");
            let value = oControlEvent.getParameters().value;
            const currentBookIndexInArray = booksArray.findIndex(book => book.ID == bookID);

            if (value > book.stock) {
                value = book.stock;

                oStepInput.setValue(book.stock);
                oStepInput.setValueState("Warning");
                oStepInput.setValueStateText(this.getResourceBundle().getText('excessAvailableAmountOfBookWarning', book.stock));

                setTimeout(() => {
                    oStepInput.setValueState("None");
                    oStepInput.setValueStateText("");
                }, 1500);

                this.getResourceBundle().getText('excessAvailableAmountOfBookWarning', book.stock)

            
            }
            
            if (value < 1 ) {
                booksArray.splice(currentBookIndexInArray, 1);
            } else if (currentBookIndexInArray == -1) {
                book.amount = value;
                book.totalPrice = (value * book.price).toFixed(2);
                booksArray.push(book);
            } else {
                booksArray[currentBookIndexInArray].amount = value;
                booksArray[currentBookIndexInArray].totalPrice = (value * book.price).toFixed(2);
            }


            this.updateTotalCost();
        },

       

        submitCreateOrderButtonPress: function (oEvent) {
            const oFormModel = this.getModel();
            const oDialog = oEvent.getSource().getParent();
            const sObjectPath = oDialog.getBindingContext().sPath;
            const fTotalCost = this.getModel("orderModel").getProperty("/totalCost");
            const oCustomerAddress =  this.getModel('orderModel').getProperty('/customerAddress');

            const sCustomerAddress = `${oCustomerAddress.street} str., ${oCustomerAddress.houseNumber}, ap. ${oCustomerAddress.apartmentNumber}`;
            
            oFormModel.setProperty(`${sObjectPath}/totalCost`, fTotalCost);
            oFormModel.setProperty(`${sObjectPath}/customerAddress`, sCustomerAddress);

            if (fTotalCost > 0) {
                if (this.onValidateFieldGroup("createOrder")) {
                    oFormModel.submitChanges();
                    
                    for (let sKey in oCustomerAddress) {
                        oCustomerAddress[sKey] = "";
                    };

                    oDialog.close(); 
                } else {
                    MessageToast.show(this.getResourceBundle().getText('fillRequiredFieldsMessageToast'));
                }
            } else {
                MessageToast.show(this.getResourceBundle().getText('emptyShoppingCardMessageToast'));
            }
        },

        _createNewOrderItems: function (sOrderID) {
            const oODataModel = this.getModel();
            const aBooksInOrder = this.getModel("orderModel").getProperty(`/booksInOrder`); 
            const aOrderItems = [];
            
            aBooksInOrder.forEach(oBookInOrder => {
                aOrderItems.push({
                    amount: oBookInOrder.amount,
                    book_ID: oBookInOrder.ID,
                    up__ID: sOrderID
                })
            })
           
            aOrderItems.forEach(oOrderItem => {
                oODataModel.create("/Orders_items", oOrderItem);
            })


            this._updateBookStockValue();
            this._resetOrderBooks();
        },

        onChangeBookInOrderAmountPress: function (oEvent) {
            const oButton = oEvent.getSource();
            const oCtx = oButton.getBindingContext("orderModel");
            const oView = this.getView();

			if (!this._pChangeBookInOrder) {
				this._pChangeBookInOrder = Fragment.load({
					id: oView.getId(),
					name:"ns.bookshop.view.fragments.ChangeBookInOrderAmountPopover",
					controller: this
				}).then(function(oPopover) {
                    oView.addDependent(oPopover);
					return oPopover;
				}.bind(this));
			}
			this._pChangeBookInOrder.then(function(oPopover) {
                oPopover.bindElement({ 
                    path: oCtx.getPath(), 
                    model: "orderModel"
                });
				oPopover.openBy(oButton);
			});
        },

        currentBookInOrderAmountChange: function (oControlEvent) {
            const aBooksInOrder = this.getModel("orderModel").getProperty(`/booksInOrder`);
            const oCurrentBook = oControlEvent.getSource().getBindingContext("orderModel").getObject();
            const sBookID = oCurrentBook.ID;
            const iCurrentBookIndexInArray = aBooksInOrder.findIndex(oBook => oBook.ID === sBookID);
            let iAmount = oControlEvent.getParameters().value;

            if (iAmount > oCurrentBook.stock) {
                oControlEvent.getSource().setValue(oCurrentBook.stock);
                iAmount = oCurrentBook.stock;
            }

            if (iAmount < 1 ) {
                aBooksInOrder.splice(iCurrentBookIndexInArray, 1);
            } else if (iCurrentBookIndexInArray == -1) {
                oCurrentBook.amount = iAmount;
                oCurrentBook.totalPrice = (iAmount * book.price).toFixed(2);
                aBooksInOrder.push(oCurrentBook);
            } else {
                aBooksInOrder[iCurrentBookIndexInArray].amount = iAmount;
                aBooksInOrder[iCurrentBookIndexInArray].totalPrice = (iAmount * oCurrentBook.price).toFixed(2);
            }

            this.updateTotalCost();
        },

        onClearOrderFromBooksPress: function () {
            MessageBox.confirm(`Are you sure want to delete all books from the order? `, {
                onClose: (oAction) => {
                    if (oAction === "OK") {
                        this._resetOrderBooks("orderModel");
                    }
                }
            });
        },

        onAfterCloseCreateOrderDialog: function (oEvent) {
            this._resetModelChanges(oEvent);
            
            this._resetFieldGroupValidation("createOrder"); 
        },

        onDeleteBookFromOrderButtonPress: function (oEvent) {
            const oBook = oEvent.getParameters().listItem.getBindingContext("orderModel").getObject();
            const booksArray = this.getModel("orderModel").getProperty(`/booksInOrder`);
            const sBookIndex = booksArray.findIndex( book => book.ID == oBook.ID );

            MessageBox.confirm(`Are you sure want to delete ${oBook.title} from the order? `, {
                onClose: (oAction) => {
                    if (oAction === "OK") {
                        booksArray.splice(sBookIndex, 1);
                        this.updateTotalCost();
                    }
                }
            });
        },

        onCustomInputChange: function (oEvent) {
            const oInput = oEvent.getSource();
            const sValue = oInput.getValue();
            const regex = /\+375\d{9}/;

            if (sValue.length > 13) {
                oInput.setValue(sValue.slice(0,13));
                this.onCustomInputChange(oEvent);
            } 

            if (sValue.length == 13) {
                if (sValue.match(regex)) {
                    oInput.setValueState("None");
                    this._validateInput(oInput);
                } else {
                    oInput.setValueState("Error");
                }
            } else {
                this._validateInput(oInput);
            }
        },

        _resetOrderBooks: function () {
            const oModel = this.getModel('orderModel');
           
            oModel.setProperty(`/booksInOrder`, []);
            oModel.setProperty(`/totalCost`, 0);
            oModel.setProperty(`/amount`, 0);
            oModel.setProperty('/totalBooksInOrderAmount', 0);

            this.byId("booksTable").getControlsByFieldGroupId("stepInput").filter(oInput => oInput.isA('sap.m.StepInput')).forEach(oInput => oInput.setValue(0));
        },

        _updateBookStockValue: function () {
            const aBooksInOrder = this.getModel('orderModel').getProperty('/booksInOrder');
            const oModel = this.getModel();
            
            aBooksInOrder.forEach(oBook => {
                const iNewBookInStockValue = oBook.stock - oBook.amount;
                oModel.setProperty(`/Books(guid'${oBook.ID}')/stock`, iNewBookInStockValue);
            })
            oModel.submitChanges();
        }
	});
});