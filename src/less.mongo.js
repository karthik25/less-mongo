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
    
    /*
     * function : less()
     * params   : <none>
     * 
     * prints the version of less.mongo
     *
     * /
	api = function () {
		return api.version();
	};

    /*
     * function : less()
     * params   : <none>
     * 
     * prints the version of less.mongo
     *
     * /
    api.version = function () {
      return print("type less do more! :: less.mongo v" + version);  
    };
    
    /*
     * function : less.help
     * params   : <none>
     * 
     * prints a message about various functions available in less.mongo
     *
     * /
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
    
    /*
     * function : less.listCollections
     * params   : regex (optional)
     * 
     * prints the collections in the current db
     * if a regex parameter is passed, collections matching
     *      the regex will be printed
     *
     * /
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
    
    /*
     * function : less.c
     * params   : regex (optional)
     * 
     * a shortcut for listCollections
     *
     * /
    api.c = api.listCollections;

    /*
     * function : less.prompt
     * params   : <none>
     * 
     * changes the default prompt '>' to 'db-name>'
     *
     * /
    api.prompt = function (){
      global.prompt = function (){
        return db.getName() +  "> ";
      };
    };
    
    return api;
}(this));
