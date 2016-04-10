angular.module('ProjectHands')

    .factory('DatabaseService', function ($resource) {

        var baseUrl = '/database';

    
        function remove(collection, query) {
            return $resource(baseUrl + '/delete/:collection&:query').remove({collection: collection, query: JSON.stringify(query)});
        }
    
        function insert(collection, data) {
            return $resource(baseUrl + '/insert').save({collection: collection, data: JSON.stringify(data)});
        }
    
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
     
        function query(collection, query) {
            return $resource(baseUrl + '/query/:collection&:query').query({collection: collection, query: JSON.stringify(query)});
        }

        return {
            insert: insert,
            remove: remove,
            update: update,
            query: query
        };
    });