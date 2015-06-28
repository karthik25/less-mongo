/* 
 * less.mongo - a simple utility to type less and get more out of the mongo shell
 * 
 *          Version: 1.0.0
 *
 * Copyright 2015
 *
 *
 */
var less = (function (global) {
    'use strict';
    
    var api,
		version = "1.0.0",
		config = {
			
		};

    var helpItems = [
        {
          title: "less()",
          parameters: "params: <none>",
          desc: "print version information"
        },
        {
          title: "less.help()",
          parameters: "params: <none>",
          desc: "print all possible functions in less"
        },
        {
            title: "less.c (or) less.listCollections",
            parameters: "params: regex (optional)",
            desc: "prints the collections in the current database. Optionally pass a regex to filter collections"
        },
        {
            title: "less.prompt",
            parameters: "params: <none>",
            desc: "change the prompt to display the current database name"
        }
    ];
    
	api = function () {
		return api.version();
	};

    api.version = function () {
      return print("type less do more! :: less.mongo v" + version);  
    };
    
    api.help = function () {
        print("#############################################################################\n");
        print("###                      less.mongo                                       ###\n");
        print("### a simple utility to type less and get more out of the mongo shell     ###\n");
        print("#############################################################################\n");
        
        helpItems.forEach(function (helpItem) {
            print("\t" + helpItem.title + "\n");
            print("\t\t " + helpItem.parameters);
            print("\n");
            print("\t\t " + helpItem.desc);
            print("\n\n");
            print("====================================================================");
        });
    };
    
    api.listCollections = function (regex) {
        var collections = db.getCollectionNames();
        collections.forEach(function (collection){
          if (regex instanceof RegExp){
              if (regex.test(collection)){
                  print(collection);
              }
          }
          else {
              print(collection);
          }
      });
    };
    
    api.c = api.listCollections;
    
    api.prompt = function (){
      global.prompt = function (){
        return db.getName() +  "> ";
      };
    };
    
    return api;
}(this));

/*
 * less.helpers - set of utilities to reduce the need to write lengthy custom js
 *
 *      Version 1.0.0
 *
 *  Copyright 2015 
 *
 */
(function (){    
    // credits: http://stackoverflow.com/q/10420352/312219
    var humanizedSize = function (bytes) {
        var i = -1;
        var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 1024);

        return Math.max(bytes, 0.1).toFixed(1) + byteUnits[i];
    };
    
    var resolveType = function (object) {
        var type = typeof object;
        if (type === "object") {
            if (object instanceof ObjectId) {
                return "ObjectId";
            }
            else if (object instanceof Array) {
                return "Array";
            }
        }
        return type;
    }
    
    var getMaxDocStats = function (cursor){
        var doc, size, maxSize = 0, maxDocId = null;
        while (cursor.hasNext()) {
            doc = cursor.next();
            size = Object.bsonsize(doc);
            if (size > maxSize) {
                maxSize = size;
                maxDocId = doc._id;
            }
        }
        
        return {
          maxSize: humanizedSize(maxSize),
          maxDocId: maxDocId
        };
    };

    var processCollection = function (db, collectionName){
       var count = db.getCollection(collectionName).count();
       var maxStats = db.getCollection(collectionName).getMaxDocStats();
       return {
          collection: collectionName,
          count: count,
          maxSize: maxStats.maxSize
       };
    }
    
    var collectionStats = function (db) {
        var stats = [];
        var collections = db.getCollectionNames();
        collections.forEach(function (collection){
           stat = processCollection(db, collection);
           stats.push(stat);
        });
        return stats;
    };    
    
    DBQuery.prototype.getMaxDocStats = function () {
      return getMaxDocStats(this);
    };
    
    DBCollection.prototype.getMaxDocStats = function (query, fields, limit, skip, batchSize, options) {
      return this.find(query, fields, limit, skip, batchSize, options).getMaxDocStats();  
    };
    
    DB.prototype.collectionStats = function () {
      return collectionStats(this);
    };
    
    DBCollection.prototype.peek = function (query, fields, peekStartCount, peekEndCount) {
        var document = this.findOne(query, fields);
        if (!peekEndCount) {
            peekEndCount = peekStartCount;
            peekStartCount = 0;
        }
        var object = {};
        var allKeys = Object.keys(document);
        for (index = peekStartCount; index <= peekEndCount; index++) {
            object[allKeys[index]] = document[allKeys[index]];
        }
        printjson(object);
    };
    
    DBCollection.prototype.schema = function (query, expandArrays) {
        if (!query) query = {};
        if (!expandArrays) expandArrays = false;
        
        var document = this.findOne(query);
        var _schema = {};

        for (var key in document) {
            _schema[key] = resolveType(document[key]);
            if (_schema[key] === "Array" && expandArrays && document[key].length > 0) {
                var firstEntry = document[key][0];
                if (typeof firstEntry === "object") {
                    var _aSchema = {};
                    for (var aKey in firstEntry) {
                        _aSchema[aKey] = resolveType(firstEntry[aKey]);
                    }
                    _schema[key] = _aSchema;
                }
                else {
                    _schema[key] = "Array(" + typeof firstEntry + ")";
                }
            }
        }
        
        return _schema;
    };
}());
