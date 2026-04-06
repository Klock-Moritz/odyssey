# Implicit `self` Links for embedded HAL resources

When sending embedded resources in the [Hypertext Application Language](https://datatracker.ietf.org/doc/html/draft-kelly-json-hal)
(HAL), it is often desirable to include only a subset of the entire resource,
and - in particular - only include the `self` link in the `_links` object, so
the client can fetch the resource to get all links.  However, when dealing with
collections of embedded items, this still leads many additional links in the
response, which are mostly redundant and degrade the human-readability of
the response.

To solve this problem, the following procedure can be applied to infer an
implicit `self` link into embedded resources:

If an embedded resource of any link relation (`rel`) contains one or more
`self` links, only these links MUST be used as the `self` link.  If `self`
links are missing, but the outer document contains one or more links of the
`rel` link relations, and those links are not templated, those links are all
considered to be the `self` links of the resource.  If those links are
templated, they are considered to be the `self` links of the embedded resource
after evaluating the template against the properties of the embedded resource.

## Example

This document

```{json}
{
  "_links": {
    "self": { "href": "/orders" },
    "orders": { "href": "/orders/{id}", templated: true },
    "author": { "href": "/me" }
  },
  "_embedded": {
    "orders": [{
      "total": 30.00,
      "currency": "USD",
      "status": "shipped"
    }, {
      "total": 20.00,
      "currency": "USD",
      "status": "processing"
    }],
    "author": {
      "name": "John Doe"
    }
  }
}
```

should be considered equivalent to this document:

```{json}
{
  "_links": {
    "self": { "href": "/orders" }
  },
  "_embedded": {
    "orders": [{
      "_links": {
        "self": { "href": "/orders/123" }
      },
      "total": 30.00,
      "currency": "USD",
      "status": "shipped",
    }, {
      "_links": {
        "self": { "href": "/orders/124" }
      },
      "total": 20.00,
      "currency": "USD",
      "status": "processing"
    }],
    "author": {
      "_links": {
        "self": { "href": "/me" }
      },
      "name": "John Doe"
    }
  }
}
```