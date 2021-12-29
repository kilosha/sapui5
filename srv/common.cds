using { sap.capire.bookshop as my } from '../db/schema';
//using AdminService as service from './admin-service';
using FioriService as service from './fiori-service';



annotate service.Authors with {
    ID @(Common : {
        Text            : name,
        TextArrangement : #TextOnly,
    });
    name @title: 'Author';
    dateOfBirth @title: 'Date of birth';
    countryOfBirth @title: 'Country of birth';
}

annotate service.Books with {
    ID @UI.Hidden;
    descr @title: 'Description' @UI.MultiLineText @mandatory;
    author @title: 'Author' @mandatory;
    genre @title: 'Genre' @mandatory;
    stock @title: 'Stock' @mandatory;
    price @title: 'Price' @mandatory;
    rating @title: 'Rating' @mandatory;
    currency @UI.Hidden @readonly;

    title @title: 'Title' @mandatory 
    ;
    //       @Common : {
    //     Text            : title,
    //     TextArrangement : #TextOnly,

    //     ValueList       : {
    //         $Type          : 'Common.ValueListType',
    //         Label          : 'Title',
    //         CollectionPath : 'Books',
    //         Parameters     : [
    //         {
    //             $Type             : 'Common.ValueListParameterInOut',
    //             LocalDataProperty : title,
    //             ValueListProperty : 'title'
    //         }
    //         ]
    //     }
    // };

    author @Common : {
        Text            : author.name,
        TextArrangement : #TextOnly,
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Author',
            CollectionPath : 'Authors',
            Parameters     : [
                {
                    $Type             : 'Common.ValueListParameterOut',
                    LocalDataProperty : author_ID,
                    ValueListProperty : 'ID'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'name'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'dateOfBirth'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'countryOfBirth'
                }
            ]
        }
    };

   genre      @Common : {
        Text            : genre.title,
        TextArrangement : #TextOnly,
        ValueList       : {
            $Type          : 'Common.ValueListType',
            Label          : 'Genre',
            CollectionPath : 'Genres',
            Parameters     : [
                {
                    $Type             : 'Common.ValueListParameterInOut',
                    LocalDataProperty : genre_title,
                    ValueListProperty : 'title'
                }
            ]
        }
    };
}

annotate service.Orders with {
    deliveryDate @title: 'Delivery date';
    customerName @title: 'Customer name';
    phoneNumber @title: 'Phone number';
    customerCity @title: 'Customer city';
    customerStreet @title: 'Customer street';
    customerHouseNumber @title: 'Customer house number';
    customerApartmentNumber @title: 'Customer apartment number';
    paymentMethod @title: 'Payment method';
    totalCost @title: 'Total cost';
    customerAddress @title: 'Customer address'
}

annotate service.Genres with {
    title @title: 'Genres';
}

annotate service.Orders_items with {
    up__ID @UI.Hidden;
    book_ID @UI.Hidden;
    amount @title: 'Current book in order amount';
}





