(function () {
    var searchButton = document.getElementById('searchButton'),
        handlebars = window.Handlebars,
        keyPressed = "";

    function searchBoxInputListener(evt) {             
        var url,
            urlEncoded,
            xhr = new XMLHttpRequest(),
            templateSource = $("#city-template").html(),
            template = handlebars.compile(templateSource);
        
        keyPressed = evt.target.value;
        url = '/home/search?keyword=' + keyPressed;
        urlEncoded = encodeURI(url);     

        xhr.onreadystatechange = function () {
            var data, html;
            if (xhr.status == 200) {
                if (xhr.readyState == xhr.DONE) {
                    data = xhr.response;
                    if (data.length > 0) {
                        cities = JSON.parse(data);
                        html = template({
                            cities: cities
                        });
                        $('#resultBox').html(html);
                    }
                }
            }
        }

        xhr.open('GET', urlEncoded, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }

    function searchButtonClickListener(evt) {
        var searchBox = document.querySelector('#searchBox'),
            keyword = searchBox.value,
            url = '/home/search?keyword=' + keyword,
            urlEncoded = encodeURI(url),
            xhr = new XMLHttpRequest(),
            templateSource = $("#city-template").html(),
            template = handlebars.compile(templateSource);
     
        xhr.onreadystatechange = function () {
            var data, html;
            if (xhr.status == 200) {
                if (xhr.readyState == xhr.DONE) {
                    data = xhr.response;                    
                    if (data.length > 0) {
                        cities = JSON.parse(data);
                        html = template({
                            cities: cities
                        });
                        $('#resultBox').html(html);                        
                    }                    
                }
            }
        }

        xhr.open('GET', urlEncoded, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();        
    }

    searchButton.addEventListener('click', searchButtonClickListener, false);
    searchBox.addEventListener('input', searchBoxInputListener, false);

}());

