(function () {
    Sphinx.City = DS.Model.extend({
        id: DS.attr('string'),
        name: DS.attr('boolean'),
        countryCode: DS.attr('string'),
        district: DS.attr('string'),
        population: Ds.attr('integer')
    });
}());