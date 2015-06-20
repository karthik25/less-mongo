/* 
 * less.mongo - a simple utility to type less and get more out of the mongo shell
 * 
 *          Version: 1.0.0
 *
 * Copyright 2015
 *
 *
 */
var less = (function(global) {
    'use strict';
    
    var api,
		version = "1.0.0",
		config = {
			defaultPrompt : 0,	// 0-4 or a string
		};

	api = function () {
		return api.version();
	};

    api.version = function () {
      return print("type less do more! :: less.mongo v" + version);  
    };
    
    api.help = function () {
        print("less.mongo - a simple utility to type less and get more out of the mongo shell\n\n");
        
        print("less.c (or) less.listCollections\n");
        print("\t params: regex (optional)");
        print("\n");
        print("\t Prints the collections in the current database. Optionally pass a regex to filter collections")
        
        print("\n\n")
    };
    
    api.c = function (regex) {
      var collections = db.getCollectionNames();
      collections.forEach(function (collection){
          if (typeof regex === "object"){
              if (regex.test(collection)){
                  print(collection);
              }
          }
          else {
              print(collection);
          }
      });
    };
    
    api.listCollections = api.c;
    
    return api;
}(this));
