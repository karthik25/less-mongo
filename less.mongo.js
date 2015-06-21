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
