var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost/postgis_test";
var fs = require('fs');

function createGeoJson(l){
    var geo = {};
    geo.type = 'Feature';
    geo.properties = {};
    Object.keys(l).forEach(function(key){
        if(key!=='geom'){
            geo.properties[key] = l[key];
        }
    });
    geo.geometry = JSON.parse(l.geom);

    return geo;

}

var data;

pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT name, group_name, coverage, status, location, values, st_asgeojson(geom) as geom, ST_X(st_centroid(geom)) as center_long, ST_Y(st_centroid(geom)) as center_lat from pit;', function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    // console.log(result.rows);
    data = result.rows.map(function(d){
        return createGeoJson(d);
    });
    // console.log(data);
    fs.writeFile('data.json', JSON.stringify(data), function(){
        console.log('written');
    });
    //output: 1
    client.end();
  });
});