using { sap.capire.bookshop as my } from '../db/schema';
service AdminService  {

    entity Books @(restrict : [
            {
                grant : [ 'READ' ],
                to : [ 'BookViewer' ]
            },
            {
                grant : [ '*' ],
                to : [ 'BookManager' ]
            }
        ]) as projection on my.Books;

    
    entity Authors as projection on my.Authors;
    entity Orders as projection on my.Orders;
    entity Genres as projection on my.Genres;


}

