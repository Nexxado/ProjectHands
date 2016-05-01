angular.module('ProjectHands')

    .factory('DatabaseService', function ($resource) {

        var baseUrl = '/api/database';

    
        /**
         * Remove a document from the database
         * @param   {string}  collection : The collection from which to remove the document
         * @param   {object}  query      : Query to be used against the database to find the document
         * @returns {object}             : Promise to be executed once data is retrieved from the server
         */
        function remove(collection, query) {
            return $resource(baseUrl + '/delete/:collection&:query').remove({collection: collection, query: JSON.stringify(query)});
        }
    
        /**
         * Add a document to the database
         * @param   {string}  collection : The collection to add the document to.
         * @param   {object}  data       : The document's data
         * @returns {object}             : Promise to be executed once data is retrieved from the server
         */
        function insert(collection, data) {
            return $resource(baseUrl + '/insert').save({collection: collection, data: JSON.stringify(data)});
        }
    

        /**
         * Update a document in the database
         * @param   {string}   collection : The collection the current document is in
         * @param   {object}   query      : Query to be used against the database to find the document
         * @param   {object}   data       : The data to be updated in the document
         * @param   {object}   options    : Options object - based on MongoDB docs
         * @returns {object}              : Promise to be executed once data is retrieved from the server
         */
        function update(collection, query, data, options) {
            return $resource(baseUrl + '/update')
                .save(
                {
                    collection: collection,
                    query: JSON.stringify(query),
                    data: JSON.stringify(data),
                    options: JSON.stringify(options)
                }
            );
        }
     

        /**
         * Query a document in the database
         * @param   {string}   collection : The collection the current document is in
         * @param   {object}   query      : Query to be used against the database to find the document
         * @returns {object}              : Promise to be executed once data is retrieved from the server
         */
        function query(collection, data) {
            return $resource(baseUrl + '/query/:collection&:query').query({collection: collection, query: JSON.stringify(data)});
        }

        return {
            insert: insert,
            remove: remove,
            update: update,
            query: query
        };
    });
