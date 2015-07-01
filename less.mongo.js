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
    
    var extend = function (settings, options) {
      for (var key in settings) {
        if (options.hasOwnProperty(key)) {
             settings[key] = options[key];   
        }
      }
      return settings;
    };
    
    var identifyValueTypes = function (object, recurse) {
        var _schema = {};
        
        for (var key in object) {
            var keyValue = object[key];
            
            if (keyValue == null) {
                _schema[key] = null;
                continue;
            }        
            
            _schema[key] = resolveType(keyValue);
            
            if (recurse && _schema[key] === "object") {
                _schema[key] = identifyValueTypes(keyValue, recurse);
            }
            
            if (recurse && _schema[key] === "Array" && keyValue.length > 0) {
                var firstEntry = keyValue[0];
                if (typeof firstEntry === "object") {
                    _schema[key] = [identifyValueTypes(firstEntry, recurse)];
                }
                else {
                    _schema[key] = [typeof firstEntry];
                }
            }
        }
        
        return _schema;
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
    
    DBCollection.prototype.schema = function (options) {
        var settings = extend({
            query: {},
            fields: {},
            recurse: false
        }, options || {});
        
        var document = this.findOne(settings.query, settings.fields);
        var _schema = identifyValueTypes(document, settings.recurse);
        
        return _schema;
    };
    
    DBCollection.prototype.findInArray = function (options) {
        var settings = extend({
            tQuery: {},
            tFields: {},
            aFieldName: '',
            aLimiter: null
        }, options || {});  
        
        if (! settings.aFieldName) {
            throw new Error("Array field name cannot be null - aFieldName");
        }
        
        var matchedArrayEntries = [];
        
        var cursor = this.find(settings.tQuery, settings.tFields);
        while (cursor.hasNext()){
            var current = cursor.next();
            var arrayField = current[settings.aFieldName];
            
            if (!settings.aLimiter) {
                matchedArrayEntries = matchedArrayEntries.concat(arrayField);
            }
            else {
                var matched;
                arrayField.forEach(function (entry) {
                    matched = false;
                    for (var key in settings.aLimiter) {
                        if (!matched && entry.hasOwnProperty(key) && entry[key] === settings.aLimiter[key]) {
                            matchedArrayEntries.push(entry);
                            matched = true;
                        }
                    }
                });
            }
        }
        
        return matchedArrayEntries;
    };
}());
