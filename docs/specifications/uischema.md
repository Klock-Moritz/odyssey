# UI Schema for JSON Forms retrieval

This document describes a method for retrieving a UI schema for the usage
with [JSON Forms](https://jsonforms.io/docs/).  Similar to the usage of
`$schema` for retrieving a [JSON Schema](https://json-schema.org/docs),
a property named `$uischema` MAY be used for JSON objects to declare the 
location of a UI schema. This property MUST be a URI, which MUST link to
a retrievable resource containing a valid UI schema.  When retrieving the
UI schema, the server should respond with a media type
`application/prs.json-forms-ui-schema+json`.

Any supporting client MAY use this URI to retrieve the UI schema and adjust
the representation of the JSON resource accordingly.  It MAY also choose to
ignore the UI schema.  When requesting the UI schema, it SHOULD include the
media type `application/prs.json-forms-ui-schema+json` in the `Accept` header
of the request.

Additionally, UI schema instances MAY provide a link to the UI schema according
to the hyperlinking rules of the underlying format.  For example, a server
could choose to send a `Link` header in a HTTP response containing the schema
instance.  If doing so, the MUST use the link relation `stylesheet` and should
specify the type of the link to `application/prs.json-forms-ui-schema+json`.
