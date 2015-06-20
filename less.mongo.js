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

    var helpItems = [
        { 
            for: "less.c (or) less.listCollections", 
            parameters: "params: regex (optional)", 
            desc: "Prints the collections in the current database. Optionally pass a regex to filter collections"  
        }
    ];
    
	api = function () {
		return api.version();
	};

    api.version = function () {
      return print("type less do more! :: less.mongo v" + version);  
    };
    
    api.help = function () {
        print("less.mongo - a simple utility to type less and get more out of the mongo shell\n\n");
                    
        helpItems.forEach(function (helpItem){
            print(helpItem.for + "\n");
            print("\t " + helpItem.parameters);
            print("\n");
            print("\t " + helpItem.desc);
            print("\n\n");
        });
    };
    
    api.listCollections = function (regex) {
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
    
    api.c = api.listCollections;
    
    return api;
}(this));
