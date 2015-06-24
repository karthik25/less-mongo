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

# less.helpers

less.helpers provides utilities that would otherwise require a lot of typing. Right now you just have 1 utility which could used to get information about the document with the maximum size

```jscript
db.collection.getMaxDoc()
```

Thanks to mesh (https://github.com/skratchdot/mesh) for the inspiration! I found mesh when I was reading about wrappers for the shell to reduce the amount of typing I do for one of the products that I work on and from that point I have never looked back :)
