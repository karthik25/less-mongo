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
