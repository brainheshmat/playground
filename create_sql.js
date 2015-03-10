var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost/postgis_test";
var fs = require('fs');
var csv = require('csv');

var reg_geom = /(GeomFromText\(')|('\)\);)/g;

var queryText = "INSERT INTO pit(name, status, group_name, coverage, location, values, geom) VALUES('";

fs.readFile('pit.txt', 'utf8', function(err, data){
  data = data.replace(reg_geom,'"')
  csv.parse(data, function(err, data){

    data = data.map(function(d){
      var q = queryText+d[0]+"','"+d[1]+"','"+d[2]+"','"+d[3]+"','"+d[4]+"','"+d[5]+"',"+"st_GeomFromText('"+d[6]+"'));";

      return q;

    });

    data = data.join('\n');

    fs.writeFile('queries.sql', data, function(){
      console.log('done');
    })

      
  });
});
