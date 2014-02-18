(function () {
    
    function Pager(pageSize) {
        var numberOfPages = 0,
            collection = [];

        this.total = 0;
        this.pages = [];

        this.removeItems = function () {
            this.total = 0;
            collection = [];
            this.pages = [];            
        }

        this.addItems = function (items) {
            var index = 0;

            this.pages = [];

            items.forEach(function (p) {
                collection.push(p);
            });
            
            numberOfPages = Math.ceil(collection.length / pageSize);

            this.total = collection.length;   

            for (index = 1; index <= numberOfPages; ++index) {
                start = pageSize * index - pageSize;
                this.pages.push({
                    page: index,
                    start: start,
                    end: pageSize * numberOfPages,
                    isLast: index === numberOfPages ? true : false,
                    showNext: collection.length >= numberOfPages * pageSize ? true : false
                });
            }
        };

        this.getItems = function (start) {
            var items = collection.slice(start, start + pageSize);
            return items;
        };
    }  

    function Connection() {
        function searchByKeyword(keyword, render) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                var data,
                    items;
                if (xhr.status == 200) {
                    if (xhr.readyState == xhr.DONE) {
                        data = xhr.response;
                        if (data) {
                            items = JSON.parse(data);
                            if (items.length > 0) {
                                render(items, true);
                            }
                        }
                    }
                };
            };
            xhr.open('GET', keyword, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
        }

        function searchByModel(searchModel, render) {
            var xhr = new XMLHttpRequest(),
                url = '/home/search';
            xhr.onreadystatechange = function () {
                var data,
                    items;
                if (xhr.status == 200) {
                    if (xhr.readyState == xhr.DONE) {
                        data = xhr.response;
                        if (data) {
                            items = JSON.parse(data);
                            if (items.length > 0) {
                                render(items);
                            }
                        }
                    }
                }
            }
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(searchModel));
        }

        return {
            searchByModel: searchByModel,
            searchByKeyword: searchByKeyword
        }
    }   

    function UI () {
        var conn = new Connection(),
                pager = new Pager(10),
                searchButton = document.querySelector('#searchButton'),
                searchBox = document.querySelector('#searchBox'),
                templateSource = $("#city-template").html(),
                handlebars = window.Handlebars,
                template = handlebars.compile(templateSource),
                searchInputChanged = function (evt) {
                    var keyPressed = evt.target.value,
                        url = '/home/search?keyword=' + keyPressed,
                        urlEncoded = encodeURI(url);
                    conn.searchByKeyword(urlEncoded, render);
                },
                searchButtonClicked = function (evt) {
                      var keyPressed = $('#searchBox').val(),
                          url = '/home/search?keyword=' + keyPressed,
                          urlEncoded = encodeURI(url);
                      conn.searchByKeyword(urlEncoded, render);
                  },
                pageClicked = function pageClicked(evt) {                   
                    var anchor = evt.target,
                        start = parseInt(anchor.getAttribute('data-start'), 10),
                        items = pager.getItems(start);                   
                    evt.preventDefault();
                    render(items, false);
                },
                nextClicked = function (evt) {
                    var keyword = $('#searchBox').val(),
                        start = parseInt(evt.target.getAttribute('data-start'), 10),
                        searchModel = {
                            keyword: keyword,
                            start: start,
                            direction: 2,
                            PageSize: 10
                        };
                    evt.preventDefault();                   
                    conn.searchByModel(searchModel, renderNew);
                }       

        function renderNew(items) {
            var next,
                html;
            pager.addItems(items);
            html = template({
                items: items,
                pages: pager.pages,
                total: pager.total,
            });

            $('#resultBox').html(html);            
            if ($('#resultBox').hasClass('invisible')) {
                $('#resultBox').removeClass('invisible');
            }
            $('a:not([id=next])').on('click', pageClicked);
            $('#next').on('click', nextClicked);
        }

        function render(items, isNew) {
            var next,
                html;
            if (isNew) {
                pager.removeItems();
                pager.addItems(items);
            }
            html = template({
                items: items,
                pages: pager.pages,
                total: pager.total,
            });
            $('#resultBox').html(html);
            if($('#resultBox').hasClass('invisible')){
                $('#resultBox').removeClass('invisible');                
            }
            $('a:not([id=next])').on('click', pageClicked);
            $('#next').on('click', nextClicked);
        }        

        function setupEventListeners() {
            $('#searchButton').on('click', searchButtonClicked);
            $('#searchBox').on('input', searchInputChanged);        
        }

        return {
            setupEventListeners: setupEventListeners
        }
    }   

    function Application() {
        this.start = function () {
            var ui = new UI();
            ui.setupEventListeners();
        }
    }

    var app = new Application();
    app.start();

}());