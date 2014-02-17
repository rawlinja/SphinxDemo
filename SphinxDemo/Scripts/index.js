(function () {
    var searchButton = document.getElementById('searchButton'),
        handlebars = window.Handlebars,
        pager = new Pager(10);

    function Pager(pageSize) {
        var numberOfPages = 0,
            collection = [];

        this.pages = [];
        this.total = 0;

        this.removeItems = function () {
            collection = [];
            this.pages = [];
            this.total = 0;
        }
        this.addItems = function (items) {
            var index = 0;

            items.forEach(function (p) {
                collection.push(p);
            });

            this.total = collection.length;

            numberOfPages = Math.ceil(collection.length / pageSize);

            this.pages = [];

            for (index = 1; index <= numberOfPages; ++index) {
                start = pageSize * index - pageSize;
                this.pages.push({
                    page: index,
                    start: start,
                    end: pageSize * numberOfPages,
                    isLast: index === numberOfPages ? true : false,
                    showNext: collection.length >= numberOfPages * pageSize ? true: false
                });
            }         

        };

        this.getItems = function (start) {
            var items = collection.slice(start, start + pageSize);
            return items;
        };
    }

    function nextClickListener(evt) {         
        var searchBox = document.querySelector('#searchBox'),
            keyword = searchBox.value,
            start = evt.target.getAttribute('data-start'),
            searchModel = {
                keyword: keyword,
                start: start,
                direction: 2,
                PageSize: 10
            };
        
        evt.preventDefault();        

        searchByModel(searchModel);       
    }

    function prevClickListener(evt) {
        var searchBox = document.querySelector('#searchBox'),
            keyword = searchBox.value,
            start = evt.target.getAttribute('data-current'),
            searchModel = {
                keyword: keyword,
                start: start,
                direction: 1,
                PageSize: 100
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

    function searchByKeyword(keyword) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            var data,
                cities;

            if (xhr.status == 200) {
                if (xhr.readyState == xhr.DONE) {
                    data = xhr.response;
                    if (data) {
                        cities = JSON.parse(data);

                        if (cities.length > 0) {
                            renderResults(cities, true);
                        }
                    }
                }
            }
        }

        xhr.open('GET', keyword, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }

    function renderResults(results, isNewResult)
    {
        var next,
            templateSource = $("#city-template").html(),
            template = handlebars.compile(templateSource),
            html;

        if (isNewResult) {
            pager.removeItems();
            pager.addItems(results);
        }

        html = template({
            items: results,
            pages: pager.pages,
            total: pager.total,
        });

        $('#resultBox').html(html);    

        items = document.getElementById('resultBox').querySelectorAll('a:not([id=next])');
       
        for (i = 0 ; i < items.length; ++i) {
            items[i].addEventListener('click', getPageEventListener, false);
        }
        
        next = document.getElementById('next');
        if (next) {
            next.addEventListener('click', nextClickListener, false);
        }
       
    }

    function renderSearchModelResults(results) {
        var templateSource = $("#city-template").html(),
            template = handlebars.compile(templateSource),
            html;

        pager.addItems(results);        

        html = template({
            items: results,
            pages: pager.pages,
            total: pager.total,
        });

        $('#resultBox').html(html);

        items = document.getElementById('resultBox').querySelectorAll('a:not([id=next])');

        for (i = 0 ; i < items.length; ++i) {
            items[i].addEventListener('click', getPageEventListener, false);
        }

        document.getElementById('next').addEventListener('click', nextClickListener, false);

    }

    function getPageEventListener(evt) {
        var anchor = evt.target,
            start,
            results;

        evt.preventDefault();     

        start = parseInt(anchor.getAttribute('data-start'), 10);

        results = pager.getItems(start);
      
        renderResults(results, false);
    }

    function searchByModel(searchModel) {
        var xhr = new XMLHttpRequest(),
            url = '/home/search';

        xhr.onreadystatechange = function () {
            var data,
                cities;

            if (xhr.status == 200) {
                if (xhr.readyState == xhr.DONE) {
                    data = xhr.response;
                    if (data) {
                        cities = JSON.parse(data);
                        if (cities.length > 0) {
                            renderSearchModelResults(cities);
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