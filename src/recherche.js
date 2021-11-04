{/* <script>
    (function() {
        document.getElementById("resultats").innerHTML = afficherResultats(
            { 
                "head": {
                    "link": [], "vars": ["image", "name", "country"] 
                },
                "results": {
                    "distinct": false, "ordered": true, "bindings": [
                        { "country": { "type": "uri", "value": "http://dbpedia.org/resource/Finland" }, "name": { "type": "literal", "xml:lang": "en", "value": "Some dish" } },
                        { "country": { "type": "uri", "value": "http://dbpedia.org/resource/Finland" }, "name": { "type": "literal", "xml:lang": "en", "value": "Some other dish" } },
                        { "country": { "type": "uri", "value": "http://dbpedia.org/resource/Finland" }, "name": { "type": "literal", "xml:lang": "en", "value": "Some third dish" } }
                    ]
                }
            }
        )
    }
    )();
</script> */}

// Affichage des résultats dans des cartes
function afficherResultats(data)
{
  var index = [];

  var contenuCartes = "";

  data.head.vars.forEach((v, i) => {
    // contenuCartes += "<th>" + v + "</th>";
    index.push(v);
  });

  data.results.bindings.forEach(r => {
    contenuCartes += "<div>";

    index.forEach(v => {

      if (r[v].type === "uri")
      {
        contenuCartes += "<div><a href='" + r[v].value + "' target='_blank'>" + r[v].value + "</a></div>";
      }
      else {
        contenuCartes += "<div>" + r[v].value + "</div>";
      }
    });


    contenuCartes += "</div>";
  });

  document.getElementById("resultats").innerHTML = contenuCartes;

}