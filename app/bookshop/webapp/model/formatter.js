sap.ui.define([
     "../model/Constants",
] , function (Constants) {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit : function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
        },
        

        /**
		 * Formatter for the icon used in a sort trigger button.
		 *
		 * @param {string} sSortType sorting type.
		 *
		 * @returns {string} icon name.
		 */
		sortTypeFormatter: function (sSortType) {
			switch (sSortType) {
				case Constants.SORT_NONE: {
					return "sort";
				}
				case Constants.SORT_ASC: {
					return "sort-ascending";
				}
				case Constants.SORT_DESC: {
					return "sort-descending";
				}
				default: {
					return "sort";
				}
			}
        },
        
        bookInOrderAmountFormatter: function (bookID) {
            let bookArray = this.getModel('worklistView').getProperty(`/booksInOrder/`);
            let currentBookInOrder = bookArray.find( book => book.ID == bookID);

            return currentBookInOrder? currentBookInOrder.amount : 0;
        }
	};
});