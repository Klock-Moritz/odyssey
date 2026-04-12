import { responsePipeline } from "./response-pipeline";

export const halJsonResponse = await responsePipeline(new Response(JSON.stringify({
  "_links": {
    "self": {
      "href": "http://localhost:3000/items"
    },
    "item": {
      "href": "http://localhost:3000/items/{id}",
      "templated": true
    },
    "index": {
      "href": "http://localhost:3000/"
    },
    "alternate": [
      {
        "href": "http://localhost:3000/items",
        "type": "text/csv"
      },
      {
        "href": "http://localhost:3000/items",
        "type": "text/tab-separated-values"
      }
    ]
  },
  "_embedded": {
    "item": [
      {
        "_links": {
          "self": {
            "href": "http://localhost:3000/items/1001"
          }
        },
        "id": 1001,
        "name": "Notebook",
        "category": "Stationery",
        "inStock": true
      },
      {
        "_links": {
          "self": {
            "href": "http://localhost:3000/items/1002"
          }
        },
        "id": 1002,
        "name": "Pen",
        "category": "Stationery",
        "inStock": true
      },
      {
        "_links": {
          "self": {
            "href": "http://localhost:3000/items/1003"
          }
        },
        "id": 1003,
        "name": "Water Bottle",
        "category": "Accessories",
        "inStock": false
      },
    ]
  }
}), {
  headers: {
    "content-length": "1717",
    "content-type": "application/hal+json; charset=utf-8",
    "link": "<http://localhost:3000/items>; rel=\"self\", <http://localhost:3000/>; rel=\"index\"; type=\"application/hal+json\", <http://localhost:3000/items>; rel=\"alternate\"; type=\"application/json\", <http://localhost:3000/items>; rel=\"alternate\"; type=\"text/csv\", <http://localhost:3000/items>; rel=\"alternate\"; type=\"text/tab-separated-values\""
  },
  status: 200,
  statusText: "OK",
}));

export const csvResponse = await responsePipeline(new Response("id,name,category,inStock\n1001,Notebook,Stationery,1\n1002,Pen,Stationery,1\n1003,Water Bottle,Accessories,1\n1004,Backpack,Bags,\n1005,Mouse,Electronics,1\n1006,Keyboard,Electronics,1\n1007,Headphones,Electronics,\n1008,Desk Lamp,Home Office,1\n1009,USB Cable,Electronics,1\n1010,Sticky Notes,Stationery,1\n", {
  headers: {
    "content-type": "text/csv; header=present"
  },
  status: 200,
  statusText: "OK",
}));