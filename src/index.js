function searchButtonClicked() {
    searchContent = document.getElementById("barre-recherche-plats").value;
    countryContent = document.getElementById("barre-recherche-pays").value;
    if (searchContent != '' || countryContent != '') {
        // launch search !
        // redirect with get parameters (if defined) of both !
        // the other page, on load, gets parameters, fetches content based on it and renders
        redirectParameters = '?' + (searchContent != ''? 'search='+searchContent : '') + (searchContent != '' && countryContent != ''? '&' : '') + (countryContent != ''? 'country='+countryContent : '');
        window.location.href = window.location.href.replace('/index.html', '/recherche.html' + redirectParameters);
    }
}