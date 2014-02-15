(function () {
    var searchButton = document.getElementById('searchButton'),
        handlebars = window.Handlebars;

    function nextClickListener(evt) {         
        var searchBox = document.querySelector('#searchBox'),
            keyword = searchBox.value,
            current = evt.target.getAttribute('data-current'),
            searchModel = {
                keyword: keyword,
                current: current,
                direction: 2
            };
        
        evt.preventDefault();        

        searchByModel(searchModel);       
    }

    function prevClickListener(evt) {
        var searchBox = document.querySelector('#searchBox'),
            keyword = searchBox.value,
            current = evt.target.getAttribute('data-current'),
            searchModel = {
                keyword: keyword,
                current: current,
                direction: 1
            };

        evt.preventDefault();      

        return searchByModel(searchModel);
    }

    function searchButtonClickListener(evt) {
        var searchBox = document.querySelector('#searchBox'),
            keyword = searchBox.value,
            url = '/home/search?keyword=' + keyword,
            urlEncoded = encodeURI(url);

        return searchByKeyword(urlEncoded);

    }

    function searchBoxInputListener(evt) {             
        var url,
            urlEncoded,           
            keyPressed = evt.target.value;

        url = '/home/search?keyword=' + keyPressed;
        urlEncoded = encodeURI(url);

        return searchByKeyword(urlEncoded);     
    }

    function searchByKeyword(keyword){
        var xhr = new XMLHttpRequest(),
            templateSource = $("#city-template").html(),
            template = handlebars.compile(templateSource);

        xhr.onreadystatechange = function () {
            var data, html, cities;
            if (xhr.status == 200) {
                if (xhr.readyState == xhr.DONE) {
                    data = xhr.response;
                    if (data){
                        cities = JSON.parse(data);
                        if (cities.length > 0) {
                            cities.prev = cities[0].Id;
                            cities.next = cities[cities.length - 1].Id;

                            html = template({
                                cities: cities
                            });

                            $('#resultBox').html(html);
                            document.querySelector('#prev').addEventListener('click', prevClickListener, false);
                            document.querySelector('#next').addEventListener('click', nextClickListener, false);
                        }
                    }
                }
            }
        }

        xhr.open('GET', keyword, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }

    function searchByModel(searchModel) {
        var xhr = new XMLHttpRequest(),
            url = '/home/search',
            templateSource = $("#city-template").html(),
            template = handlebars.compile(templateSource);

        xhr.onreadystatechange = function () {
            var data, html, cities;
            if (xhr.status == 200) {
                if (xhr.readyState == xhr.DONE) {
                    data = xhr.response;
                    if (data) {
                        cities = JSON.parse(data);
                        if (cities.length > 0) {
                            cities.prev = cities[0].Id;
                            cities.next = cities[cities.length - 1].Id;

                            html = template({
                                cities: cities
                            });

                            $('#resultBox').html(html);
                            document.querySelector('#next').addEventListener('click', nextClickListener, false);
                            document.querySelector('#prev').addEventListener('click', prevClickListener, false);

                        }
                    }
                }
            }
        }

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(searchModel));
    }   

    searchButton.addEventListener('click', searchButtonClickListener, false);
    searchBox.addEventListener('input', searchBoxInputListener, false);
     

}());

