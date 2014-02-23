(function () {
    
    function Pager(name, pageSize) {
        var numberOfPages = 0,
            collection = [];

        this.total = 0;
        this.pages = [];
        this.name = name;

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
                searchButton = document.querySelector('#searchButton'),
                searchBox = document.querySelector('#searchBox'),
                cityTemplateSource = $("#city-template").html(),
                countryTemplateSource = $('#country-template').html(),
                cityPager = new Pager('City', 20),
                countryPager = new Pager('Country', 20),
                pagesTemplateSource = $("#pages-template").html(),
                handlebars = window.Handlebars,
                cityTemplate = handlebars.compile(cityTemplateSource),
                pagesTemplate = handlebars.compile(pagesTemplateSource),
                countryTemplate  = handlebars.compile(countryTemplateSource),
                searchInputChanged = function (evt) {
                    var keyPressed = evt.target.value,
                        menuSelection = parseInt($('input[type=radio]:checked').val());
                        searchModel = {
                            keyword: keyPressed,
                            menuSelection: menuSelection,
                            start: 0,
                            direction: 0,
                            PageSize: 20
                        };

                        if (menuSelection === 1) {
                            conn.searchByModel(searchModel, renderCity);
                        } else if (menuSelection === 2) {
                            conn.searchByModel(searchModel, renderCountry);
                        }
                },
                searchButtonClicked = function (evt) {
                    var keyPressed = $('#searchBox').val(),
                        menuSelection = parseInt($('input[type=radio]:checked').val(), 10);                
                        searchModel = {
                            keyword: keyPressed,
                            menuSelection: menuSelection,
                            start: 0,
                            direction: 0,
                            PageSize: 20
                        };
                        if (menuSelection === 1) {
                            conn.searchByModel(searchModel, renderCity);
                        } else if (menuSelection === 2) {
                            conn.searchByModel(searchModel, renderCountry);
                        }
                },

                pageClicked = function pageClicked(evt) {
                    var anchor = evt.target,
                        start = parseInt(anchor.getAttribute('data-start'), 10),
                        menuSelection = parseInt($('input[type=radio]:checked').val(), 10),
                        items;
                    evt.preventDefault();
                    if(menuSelection === 1){
                        items = cityPager.getPage(start);
                        updateCity(items);
                    }else if(menuSelection === 2){
                        items = countryPager.getPage(start);
                        updateCountry(items);
                    }                  
                },

                nextClicked = function (evt) {
                    var keyword = $('#searchBox').val(),
                        start = parseInt(evt.target.getAttribute('data-start'), 10),
                        menuSelection = parseInt($('input[type=radio]:checked').val(), 10),
                        searchModel = {
                            keyword: keyword,
                            menuSelection: menuSelection,
                            start: start,
                            direction: 2,
                            PageSize: 20
                        };
                    evt.preventDefault();
                    if (menuSelection === 1) {
                        conn.searchByModel(searchModel, updateNextCity); 
                    } else if (menuSelection === 2) {
                        conn.searchByModel(searchModel, updateNextCountry);
                    }                    
                },
                menuClicked = function (evt) {
                    $('input[type=radio]:checked').parent('label').addClass('lightgray-background');
                    $('input:not([type=radio]:checked)').parent('label').removeClass('lightgray-background');                  
                    searchButtonClicked(evt);
                };

        function updateCity(items) {
            var html;     

            html = cityTemplate({
                items: items
            });

            $('#results').html(html);
            if ($('#results').hasClass('invisible')) {
                $('#results').removeClass('invisible');
            }
        }


        function updateCountry(items) {
            var html;

            html = countryTemplate({
                items: items
            });

            $('#results').html(html);
            if ($('#results').hasClass('invisible')) {
                $('#results').removeClass('invisible');
            }
        }


        function updateNextCity(items) {
            var pagesHtml;

            cityPager.addItems(items);

            pagesHtml = pagesTemplate({
                pages: cityPager.pages,
                total: cityPager.total,
                name: cityPager.name
            });        

            $('#pages').html(pagesHtml);
            if ($('#pages').hasClass('invisible')) {
                $('#pages').removeClass('invisible');
            }
            $('a:not([id=next])').on('click', pageClicked);
            $('#next').on('click', nextClicked);
        }

        function updateNextCountry(items) {
            var pagesHtml;

            countryPager.addItems(items);

            pagesHtml = pagesTemplate({
                pages: countryPager.pages,
                total: countryPager.total,
                name: countryPager.name
            });

            $('#pages').html(pagesHtml);
            if ($('#pages').hasClass('invisible')) {
                $('#pages').removeClass('invisible');
            }
            $('a:not([id=next])').on('click', pageClicked);
            $('#next').on('click', nextClicked);
        }

        function renderCity(items) {
            var resultHtml,
                pagesHtml;

            cityPager.removeItems();
            cityPager.addItems(items);            

            resultHtml = cityTemplate({
                items: cityPager.getPage(1),          
            });

            pagesHtml = pagesTemplate({
                pages: cityPager.pages,
                total: cityPager.total,
                name: cityPager.name,
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

        function renderCountry(items) {
            var resultHtml,
                pagesHtml;

            countryPager.removeItems();
            countryPager.addItems(items);

            resultHtml = countryTemplate({
                items: countryPager.getPage(1),
            });

            pagesHtml = pagesTemplate({
                pages: countryPager.pages,
                total: countryPager.total,
                name: countryPager.name
            });

            $('#results').html(resultHtml);
            if ($('#results').hasClass('invisible')) {
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
            $('input[type=radio]').on('click', menuClicked);
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