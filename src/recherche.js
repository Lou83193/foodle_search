function cleanSearchResults() {
  document.getElementById('results-container').innerHTML = '';
}

function displaySearchResult(index, result) {
  // todo : fetch & display detailed info !
  let template = document.getElementById('searchResult');
  let newNode = document.importNode(template.content, true);
  let cardImage = newNode.querySelector('img'); // todo : fill info
  let cardTitle = newNode.querySelector('h5');
  cardTitle.innerHTML = result['name'].value; // todo : fill correctly
  let cardText = newNode.querySelector('p'); // todo : fill info
  let countryLink = newNode.querySelector('a'); // todo : fill info
  document.getElementById('results-container').appendChild(newNode);
}

function loadSearch() {
  // todo : handle country filter if not null, HANDLE SEARCH CONTENT NULL
  // get parameters (null if not defined)
  let searchContent = findGetParameter('search');
  let countryFilter = findGetParameter('country');
  console.log('Searched for (query, country):', searchContent, countryFilter);
  let query = 'SELECT DISTINCT ?Food, ?name WHERE {\n' +
      '  ?Food a dbo:Food ; dbp:name ?name ; rdfs:label ?label .\n' +
      '\n' +
      '  FILTER((lang(?name) = "" || langMatches(lang(?name), "fr")) || (lang(?label) = "" || langMatches(lang(?label), "fr")) || (lang(?name) = "" || langMatches(lang(?name), "en")) || (lang(?label) = "" || langMatches(lang(?label), "en")))\n' +
      '  FILTER (regex(?name, "(?i){1}") || regex(?label, "(?i){1}"))\n' +
      '} LIMIT 100';
  query = query.replaceAll('{1}', searchContent);
  rechercher(query, data => {
    console.log(data);
    cleanSearchResults();

    let index = [];
    data.head.vars.forEach((v, _) => {
      index.push(v);
    });

    data.results.bindings.forEach(r => {
      displaySearchResult(index, r);
    });
  });
}




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