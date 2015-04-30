var Data = function() {
    this.europeCountries = [{"id": "pt", en: "Portugal", de: "Portugal", "class": "eu europe"}, {
        "id": "es",
        en: "Spain",
        de: "Spanien",
        "class": "eu europe"
    }, {"id": "be", en: "Belgium", de: "Belgien", "class": "eu europe"}, {
        "id": "it",
        en: "Italy",
        de: "Italien",
        "class": "eu europe"
    }, {"id": "pl", en: "Poland", de: "Polen", "class": "eu europe"}, {
        "id": "fi",
        en: "Finlandia",
        de: "Finnland",
        "class": "eu europe"
    }, {"id": "de", en: "Germany", de: "Deutschland", "class": "eu europe"}, {
        "id": "se",
        en: "Sweden",
        de: "Schweden",
        "class": "eu europe"
    }, {"id": "cy", en: "Cyprus", de: "Zypern", "class": "eu europe"}, {
        "id": "ie",
        en: "Ireland",
        de: "Irland",
        "class": "eu europe"
    }, {"id": "uk", en: "United Kingdom", de: "Vereinigtes Königreich", "class": "eu europe"}, {
        "id": "at",
        en: "Austria",
        de: "Österreich",
        "class": "eu europe"
    }, {"id": "cz", en: "Czech Republic", de: "Tschechien", "class": "eu europe"}, {
        "id": "sk",
        en: "Slovakia",
        de: "Slowakei",
        "class": "eu europe"
    }, {"id": "hu", en: "Hungary", de: "Ungarn", "class": "eu europe"}, {
        "id": "lt",
        en: "Lithuania",
        de: "Litauen",
        "class": "eu europe"
    }, {"id": "lv", en: "Latvia", de: "Lettland", "class": "eu europe"}, {
        "id": "ro",
        en: "Romania",
        de: "Rumänien",
        "class": "eu europe"
    }, {"id": "bg", en: "Bulgaria", de: "Bulgarien", "class": "eu europe"}, {
        "id": "ee",
        en: "Estonia",
        de: "Estland",
        "class": "eu europe"
    }, {"id": "lu", en: "Luxembourg", de: "Luxemburg", "class": "eu europe"}, {
        "id": "fr",
        en: "France",
        de: "Frankreich",
        "class": "eu europe"
    }, {"id": "nl", en: "Netherlands", de: "Niederlande", "class": "eu europe"}, {
        "id": "si",
        en: "Slovenia",
        de: "Slowenien",
        "class": "eu europe"
    }, {"id": "dk", en: "Denmark", de: "Dänemark", "class": "eu europe"}, {
        "id": "mt",
        en: "Malta",
        de: "Malta",
        "class": "eu europe"
    }, {"id": "hr", en: "Croatia", de: "Kroatien", "class": "eu europe"}, {
        "id": "gr",
        en: "Greece",
        de: "Griechenland",
        "class": "eu europe"
    }, {"id": "im", en: "", de: "", "class": "europe"}, {"id": "is", en: "", de: "", "class": "europe"}, {
        "id": "by",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "no", en: "", de: "", "class": "europe"}, {"id": "ua", en: "", de: "", "class": "europe"}, {
        "id": "tr",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "ch", en: "", de: "", "class": "europe"}, {"id": "md", en: "", de: "", "class": "europe"}, {
        "id": "al",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "ad", en: "", de: "", "class": "europe"}, {"id": "sm", en: "", de: "", "class": "europe"}, {
        "id": "mc",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "li", en: "", de: "", "class": "europe"}, {"id": "ba", en: "", de: "", "class": "europe"}, {
        "id": "mk",
        en: "",
        de: "",
        "class": "europe"
    }, {"id": "va", en: "", de: "", "class": "europe"}, {"id": "gl", en: "", de: "", "class": null}, {
        "id": "ma",
        en: "",
        de: "",
        "class": null
    }, {"id": "tn", en: "", de: "", "class": null}, {"id": "dz", en: "", de: "", "class": null}, {
        "id": "jo",
        en: "",
        de: "",
        "class": null
    }, {"id": "tm", en: "", de: "", "class": null}, {"id": "kz", en: "", de: "", "class": null}, {
        "id": "il",
        en: "",
        de: "",
        "class": null
    }, {"id": "sa", en: "", de: "", "class": null}, {"id": "iq", en: "", de: "", "class": null}, {
        "id": "az",
        en: "",
        de: "",
        "class": null
    }, {"id": "ir", en: "", de: "", "class": null}, {"id": "ge", en: "", de: "", "class": null}, {
        "id": "sy",
        en: "",
        de: "",
        "class": null
    }, {"id": "am", en: "", de: "", "class": null}, {"id": "lb", en: "", de: "", "class": null}, {
        "id": "ru-main",
        en: "",
        de: "",
        "class": null
    }, {"id": "lakes", en: "", de: "", "class": null}, {
        "id": "rs",
        en: "",
        de: "",
        "class": "cet"
    }, {"id": "ru-kaliningrad", en: "", de: "", "class": "europe ru"}, {"id": "me", en: "", de: "", "class": "cet"}];
};

Data.prototype = {
    getEUcountries: function () {
        return this.europeCountries.filter(function (c) {
            return c.class === "eu europe";
        });
    }

};

module.export = new Data();
