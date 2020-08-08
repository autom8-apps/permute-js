# Smelter JS

## The problem with reactive state management systems

**Kyle Simpson, author of the popular series, "You Don't Know JavaScript" stated, that 99% of bugs are caused by value immutability**. Currently, most tech companies use a modern reactive framework like Vue or React to build their applications which both are amazing frameworks and make the developer's life a lot easier. The problem is that currently these frameworks depend on mutable data structures for re-rendering. I can't speak to the accuracy of that statistic by I myself have seen many times a good application begin to crumble as we add more API integrations, more features, overall, more data. It is my personal belief that by normalizing and validating our data automatically we can lower our bug density considerably and eliminate things like form validation libraries altogether using schema definitions for our data and error boundary to catch and validation errors that occur at the state management level dumbing down our components even further and keeping the data interaction where it should be, in the state management system.

Smelter is hopefully a useful answer to the above problem!

## Usage

The entry point to the formatter is through the **smelt()** facade which takes two arguments, the data you want to format, and the schema to which the data should be formatted to.

## Normalization

```js
async GET_PRODUCTS({ commit }) {
  const schema = {
    title: String,
    description: String,
    tags: Array,
    variants: {
      title: String,
      price: Number,
      compareAtPrice: Number,
    }
  }

  const res = await fetch("https://api.com/products");
  const { products } = await res.json();
  const formatted = await smelt(products, schema);
  commit("SET_PRODUCTS", formatted);
}
```

### And if you're using the corresponding vuex plugin: https://link-to-vuex-plugin.com

```js
export const PRODUCTS_MODULE = {
  actions: {
    async GET_PRODUCTS({ commit }) {
      const res = await fetch("https://api.com/products");
      const { products } = await res.json();
      const formatted = await smelt(products, schema);
      commit("SET_PRODUCTS", formatted);
    }
  },
  schema: {
    title: String,
    description: String,
    tags: Array,
    variants: {
      title: String,
      price: Number,
      compareAtPrice: Number,
    }
  }
}
```

A couple of things to take note of here.
- variants in the above schema can be a single child resource or a collection of object, data smelter detects relationships for based on the shape of the data and detects nested and root level collection data so if you have the following api response the above schema format it as follows:

API RESPONSE:
```json
{
  "products": [
    {
      "id": 1,
      "title": "sample",
      "description": "sample",
      "tags": ["tag1", "tag2", "tag3"],
      "variants": {
        "title": "sample",
        "price": 20,
        "compareAtPrice": 30,
      }
    },
    {
      "id": 2,
      "title": "sample",
      "description": "sample",
      "tags": ["tag1", "tag2", "tag3"],
      "variants": [
        {
          "title": "sample",
          "price": 20,
          "compareAtPrice": 30,
        },
        {
          "title": "sample",
          "price": 20,
          "compareAtPrice": 30,
        }
      ]
    }
  ]
}
```

OUTPUT:
```js
{
  products: {
    "1": {
      id: 1,
      title: "sample",
      description: "sample",
      tags: ["tag1", "tag2", "tag3"],
      variants: [1, 2]
    },
    "2": {

        id: 1,
        title: "sample",
        description: "sample",
        tags: ["tag1", "tag2", "tag3"],
        variants: [3,4]
    }
  },
  variants: {
    "1": {
      id: 1,
      title: "sample",
      price: 20,
      compareAtPrice: 30,
      belongsTo: 1
    },
    "2": {
      id: 2,
      title: "sample",
      price: 20,
      compareAtPrice: 30,
      belongsTo: 1
    },
    "3": {
      id: 3,
      title: "sample",
      price: 20,
      compareAtPrice: 30,
      belongsTo: 2
    }
    "4": {
      id: 4,
      title: "sample",
      price: 20,
      compareAtPrice: 30,
      belongsTo: 2
    }
  }
}
```

### Relationships

Currently relationships are pretty simple. Smelter analyzes your data and if you there are nested collections, it assumed the nested collection of object are children of the parent and therefore represent a one to many relationship. This one to many relationship is represented in the example above as an array of ids on the parent under the childs property name. The child has a belongsTo property appended to it with the id back to the parent. Other normalization libraries use this method and claim that the array of ids can be used for all sorts of operation like sorting, filtering etc. in a much easier way than your typical iterative approach. If you use lodash you can offload the querying for all child objects to a function like (https://lodash.com/docs/4.17.15#zipObject)[zipObject]

The idea behind the dictionary output is that dictionaries are exceptionally easily to update query against. Of course, some operation are nearly the same like filtering by an object's property but at least this shape makes the majority of your typical operations O(1) instead of O(n)|O(n^2). It also makes your code state management system so much cleaner and that means easier to test and easier to maintain.

## Validation

Just like a database requires you to define the types in your schema so does smelter. Validation happens prior to normalization and is pretty naive at this point not going to lie. It validates your data by Object types. If you provide an array with a null value and a type the property is **optional**. Data inside of Array are not currently being validated (coming soon).

### Nested schemas

Like variants in the example below, if you provide a nested schema, smelter will validate the entire collection of object if variants is an Array, if not, it will validate the single object. When validation errors occur, smelter waits until the entire object has been validated and outputs all of the properties and their corresponding error so you can quickly remedy any issues.

## Testing

```
npm run test
npm run yarn
```

If you have an object
```js
async GET_PRODUCTS({ commit }) {
  const schema = {
    title: String,
    description: String,
    tags: [Array, null],
    variants: {
      title: String,
      price: Number,
      compareAtPrice: Number,
    }
  }

  const res = await fetch("https://api.com/products");
  const { products } = await res.json();
  const formatted = await smelt(products, schema);
  commit("SET_PRODUCTS", formatted);
}
```