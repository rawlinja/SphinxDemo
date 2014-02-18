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
        };

        this.addItems = function (items) {
            var index;

            this.pages = [];

            items.forEach(function (i) {
                collection.push(i);
            });            

            numberOfPages = Math.ceil(collection.length / pageSize);

            this.total = collection.length;

            for (index = 1; index <= numberOfPages; ++index) {
                this.pages.push({
                    number: index,
                    start: pageSize * index - pageSize,
                    end: pageSize * index + 1,
                    isLast: index === numberOfPages ? true : false,
                    showNext: collection.length >= numberOfPages * pageSize ? true : false
                });
            }
        };

        this.getPage = function (start) {
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
                                render(items);
                            }
                        }
                    }
                };
            };
            xhr.open('GET', keyword, true);            
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
                pager = new Pager(20),
                searchButton = document.querySelector('#searchButton'),
                searchBox = document.querySelector('#searchBox'),
                resultTemplateSource = $("#results-template").html(),
                pagesTemplateSource = $("#pages-template").html(),
                handlebars = window.Handlebars,
                resultTemplate = handlebars.compile(resultTemplateSource),
                pagesTemplate = handlebars.compile(pagesTemplateSource),

                searchInputChanged = function (evt) {
                    var keyPressed = evt.target.value,
                        url = '/home/search?keyword=' + keyPressed,
                        urlEncoded = encodeURI(url);
                    conn.searchByKeyword(urlEncoded, renderResult);
                },

                searchButtonClicked = function (evt) {
                      var keyPressed = $('#searchBox').val(),
                          url = '/home/search?keyword=' + keyPressed,
                          urlEncoded = encodeURI(url);
                      conn.searchByKeyword(urlEncoded, renderResult);
                },

                pageClicked = function pageClicked(evt) {                   
                    var anchor = evt.target,
                        start = parseInt(anchor.getAttribute('data-start'), 10),
                        items = pager.getPage(start);                   
                    evt.preventDefault();
                    updateResult(items);
                },

                nextClicked = function (evt) {
                    var keyword = $('#searchBox').val(),
                        start = parseInt(evt.target.getAttribute('data-start'), 10),
                        searchModel = {
                            keyword: keyword,
                            start: start,
                            direction: 2,
                            PageSize: 20
                        };
                    evt.preventDefault();                   
                    conn.searchByModel(searchModel, updateNextResult);
                }

        function updateResult(items) {
            var html;     

            html = resultTemplate({
                items: items
            });

            $('#results').html(html);
            if ($('#results').hasClass('invisible')) {
                $('#results').removeClass('invisible');
            }
        }


        function updateNextResult(items) {
            var pagesHtml;

            pager.addItems(items);

            pagesHtml = pagesTemplate({
                pages: pager.pages,
                total: pager.total,
            });        

            $('#pages').html(pagesHtml);
            if ($('#pages').hasClass('invisible')) {
                $('#pages').removeClass('invisible');
            }
            $('a:not([id=next])').on('click', pageClicked);
            $('#next').on('click', nextClicked);
        }

        function renderResult(items) {
            var resultHtml,
                pagesHtml;

            pager.removeItems();
            pager.addItems(items);            

            resultHtml = resultTemplate({
                items: pager.getPage(1),          
            });

            pagesHtml = pagesTemplate({
                pages: pager.pages,
                total: pager.total,
            });


            $('#results').html(resultHtml);
            if($('#results').hasClass('invisible')){
                $('#results').removeClass('invisible');                
            }            

            $('#pages').html(pagesHtml);
            if ($('#pages').hasClass('invisible')) {
                $('#pages').removeClass('invisible');
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

} ());