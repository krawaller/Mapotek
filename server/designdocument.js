{
   "_id": "_design/v1.0",
   "views": {
       "apotek": {
           "map": "function(doc){ if(doc.apotek){ emit(doc.apotek, doc); } }"
       }
   }
}