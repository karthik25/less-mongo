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
            aFieldName: null,
            aLimiter: null,
            parentIdentifier: null
        }, options || {});
        
        if (! settings.aFieldName) {
            throw new Error("Array field name cannot be null - aFieldName");
        }
        
        var matchedArrayEntries = [];
        
        var cursor = this.find(settings.tQuery, settings.tFields);
        while (cursor.hasNext()){
            var current = cursor.next();
            var arrayField = current[settings.aFieldName];
            var parentId = {};
            if (settings.parentIdentifier) {
                if (typeof settings.parentIdentifier === "string") {
                    parentId[settings.parentIdentifier] = current[settings.parentIdentifier];
                }
                else if (typeof settings.parentIdentifier === "function") {
                    parentId["p__obj"] = settings.parentIdentifier(current);   
                }
            }
            
            if (!settings.aLimiter) {
                matchedArrayEntries = matchedArrayEntries.concat(arrayField);
            }
            else {
                var matched;
                arrayField.forEach(function (entry) {
                    matched = false;
                    for (var key in settings.aLimiter) {
                        if (!matched && entry.hasOwnProperty(key)) {
                            if ((settings.aLimiter[key] instanceof RegExp && settings.aLimiter[key].test(entry[key])) ||
                                (entry[key] === settings.aLimiter[key])) {
                                if (settings.parentIdentifier) {                                    
                                    entry["p__id"] = parentId;
                                }
                                matchedArrayEntries.push(entry);
                                matched = true;
                            }
                        }
                    }
                });
            }
        }
        
        return matchedArrayEntries;
    };
    
    DBCollection.prototype.set = function (query, update, options) {
        var updateOptions = options || {};
        return this.update(query, { $set: update }, updateOptions);
    };
}());
