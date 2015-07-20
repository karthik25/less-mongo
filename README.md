# less.mongo

less.mongo is a utility that acts as an extension to the mongo shell. If you are fed up of typing a lot of things in the mongo shell, this is the way to go. Of course, there are numerous IDE's for mongo. But imagine the scenario where mongo executables are deployed as part of your product and also that you can't include IDE's too. In that case this is the perfect way to go! To use this, just pass the full path to the mongo executable

```text
mongo --shell less.mongo.js
```

To print version information:

```jscript
> less()
```

To get a list of all possible options, type:

```jscript
> less.help()
```

If you are interested in investing more time in less.mongo, check out the [wiki](https://github.com/karthik25/less-mongo/wiki)!!

## Bonus utilities

less.mongo includes the underscore.js library. So you also get to use the functions provided by underscore automatically! For example:

```jscript
> var arr = db.collection.find({ }).toArray()
> _.first(arr, 1)
```

The above set of lines, first "finds" all the entries in a collection and just prints the first entry using the `first` utility provided by underscore!

# Building/ Contributing

To contribute/modify and re-build the `less.mongo.js` file, you need to have `npm` installed, so that you can install the grunt package. Instead of modifying the less.mongo.js file, you just have to modify the files within the `src` folder. To regenerate the file, do the following:

```shell
c:\mongodb\bin\less.mongo> npm install
c:\mongodb\bin\less.mongo> grunt
```

Thanks to mesh (https://github.com/skratchdot/mesh) for the inspiration! I found mesh when I was reading about wrappers for the shell to reduce the amount of typing I do for one of the products that I work on and from that point I have never looked back :)
