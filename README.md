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

less.helpers provides utilities that would otherwise require a lot of typing. Right now you have the following utilities.

Gets the document with the maximum size, there is also an extension to DBQuery

```jscript
> db.collection.getMaxDocStats()
```

The next utility gets you a list of the collections in the current database, that contains helpful information like row count, max document size

```jscript
> db.collectionStats()
```

The next useful utility is a .schema utility. Mesh also has one which is much more comprehensive but this is a lot simpler utility to quickly have a peek at the schema.

```jscript
> db.collection.schema(options)
```

Possible values for options include - query, fields, recurse

```jscript
{
    /* any valid mongo query */
    query: {},
    /* any valid mongo field list */
    fields: {},
    /* identify the schema for nested object too, valid values are true | false */
    recurse: true
}
```

You can now also query and return only matchin array entries, using the .findInArray utility!!

```jscript
> db.collection.findInArray(options)
```

Possible values for options include - tQuery (top-level query), tFields (top-level fields), aFieldName (the array field name) and aLimiter (the filter to be applied for the array entries). At this point the key/value pairs cannot be complex and can only be simple equalities, performed using ===

```jscript
{
    /* top level query to limit documents */
    tQuery: {},
    /* top level field limiter, should include the array being filtered (obviously!) */
    tFields: {},
    /* Name of array field that you wish to filter further */
    aFieldName: 'someArrayField',
    /* Filter for the entries in the array, an exact match or a regex */
    /*            and its treated as a list of "or" conditions */
    aLimiter: { "someField": "someValue", "someOtherField": /regex/ }
}
```

To update value(s) in mongo, you need to use `$set`. If you don't or just forget, the entire record is going to be overwritten. To avoid this less.mongo contains a wrapper called set. When you use this wrapper the update call is always wrapped with the `$set` modifier. Here is how you could use it:

```jscript
> db.collection.set({ }, {"someField": "someValue"})
```

# less.iterables

Even if you have used mongo once, you must have used iterables. For example if you write a `find()` query and if the result set has more than 10 entries, you get to first see 10 entries and then you have to enter it to display the next 10 and so on. With that said lets look at the utilities that supports iterables, one by one.

The first function is something you already know. Earlier you were introduced to `findInArray`. This function acts as a wrapper this utility and is called `findInArray2`. This is how you would use it:

```jscript
> db.collection.findInArray2(options)
```

The options are the same as the ones for `findInArray`, with the exception of `defaultCount`, which is the number of items to be displayed per iteration. The default value is 10. When the above query is executed, you get to see the first 10 results. If the result count is less than 10, you get to see all of them. To see the next 10 result (or if there are any more results), enter the following:

```jscript
> it()
```

With this you will either see more results or just the message **iterator exhausted**, if there is nothing more to display.

# Bonus utilities

less.mongo includes the underscore.js library. So you also get to use the functions provided by underscore automatically! For example:

```jscript
> var arr = db.collection.find({ }).toArray()
> _.first(arr, 1)
```

The above set of lines, first "finds" all the entries in a collection and just prints the first entry using the `first` utility provided by underscore!

Thanks to mesh (https://github.com/skratchdot/mesh) for the inspiration! I found mesh when I was reading about wrappers for the shell to reduce the amount of typing I do for one of the products that I work on and from that point I have never looked back :)
