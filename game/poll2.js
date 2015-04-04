Poll2 = function (voteItem) {
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
    this.voteType = voteItem.opts[0];
    this.text = voteItem.text || "";
    this.voteOptions = voteItem.voteOptions ? JSON.parse(JSON.stringify(voteItem.voteOptions)) : [];    //deep clone
    this.voteMulti = voteItem.voteMulti || 1;
    this.ratedVote = voteItem.flags ? voteItem.flags[0] : false;
    this.time = voteItem.time;
    this.votes = [];
    this.multiplier = [];
    this.voteCount = 0;
    this.maxVotes = voteItem.maxVotes || 0;
    this.invalidVotes = 0;
    this.open = true;
    this.init();
};

Poll2.prototype = {
    init: function () {
        this.invalidVotes = 0;
        if (this.voteType == "enterNumber") {
            this.voteOptions = [{val: 0, checked: false}];
        }
        if (this.voteType == "countryChoice") {
            var lang = voteItem.opts[2];
            this.voteOptions = this.getEUcountries().map(function (c) {
                return {val: c.id, text: c[lang]}
            });
        }
        this.voteOptions.forEach(function (opt) {
            opt.result = 0;
            opt.votes = 0;
        });

    },
    setMaxVotes: function (x) {
        this.maxVotes = x;
    },
    //votes werden per id ins array geschrieben und nicht einfach gepusht, damit wir später wissen, wer gevoted hat
    setVote: function (id, vote, multiplier) {
        if (!this.open) return;
        if (typeof this.votes[id] != "undefined") return false;
        this.votes[id] = vote;
        if (typeof multiplier == "undefined") multiplier = 1;
        this.multiplier[id] = multiplier;
        this.evalVote(id, vote);
        if (this.votes);
    },
    evalVote: function(id, vote) {
        var checked = 0;
        for (var j = 0; j < vote.length; j++) {
            if (vote[j].checked) {
                checked++;
                this.voteCount += this.multiplier[id];
                if (this.voteType == "enterNumber") {
                    this.voteOptions[j].result += parseFloat(vote[j].val);
                }
                else {
                    this.voteOptions[j].result += this.multiplier[id];
                }
                this.voteOptions[j].votes += 1;
            }
        }
    },
    finish: function () {
        this.open = false;
        //wir wollen auswerten unter berücksichtigung von "enthaltungen": nicht eingegangene votes und votes ohne checked option
        //entweder kennen wir die erwartete stimmanzahl (this.maxVotes>0)
        // oder wir nehmen die länge des votes-arrays (dabei entgehen uns natürlich enthaltungen am ende des arrays)
        var max = (this.maxVotes > 0) ? this.maxVotes : this.votes.length;
        for (var i = 0; i < max; i++) {
            if (typeof this.votes[i] == "undefined") {
                //eine nicht abgegebene Stimme
                this.invalidVotes++;
            }
        }
    },
    getResult: function () {
        return this.voteOptions.map(function (opt) {
            return {text: opt.text, result: opt.result, resultPercentage: opt.result/this.voteCount, votes: opt.votes};
        });
    },
    getInvalid: function() {
        return this.invalidVotes;
    },
    getBestOption: function () {
        return this.voteOptions.sort(function (a, b) {
            return b.result - a.result
        })[0];
    },
    getSum: function (id) {
        return this.voteOptions[id].result;
    },
    getAverage: function (id) {
        return this.getSum(id) / this.voteCount;
    },
    getMax: function (id) {
        return this.votes.sort(function (b, a) {
            return a[id].val - b[id].val
        })[0][id].val;
    },
    getMin: function (id) {
        return this.votes.sort(function (a, b) {
            return a[id].val - b[id].val
        })[0][id].val;
    },
    setMultiplier: function (id, mult) {
        this.multiplier[id] = mult;
    },
    getEUcountries: function () {
        return this.europeCountries.filter(function (c) {
            return c.class == "eu europe";
        });
    },
    getWsContent: function () {
        var content = {
            voteId: voteId,
            type: "vote",
            text: this.text,
            voteOptions: this.voteOptions,
            voteMulti: this.voteMulti,
            ratedVote: this.ratedVote,
            voteType: this.voteType,
            time: this.time
        };
        return content;
    }
};

var test = new Poll({opts: ['enterNumber']});
test.setVote(0, [{val: 1, checked: true}]);
test.setVote(2, [{val: 3, checked: true}]);
test.setVote(3, [{val: 5, checked: true}]);
console.log(test.votes);
console.log(test.getSum(0));
console.log(test.getAverage(0));
console.log(test.getMin(0));
console.log(test.getMax(0));
console.log(test.voteOptions);

console.log("test2");
var test2 = new Poll({
    opts: ["customOptions"],
    voteOptions: [{text: "A", checked: false}, {text: "B", checked: false}]
});
test2.setVote(0, [{checked: true }, {checked: false}]);
test2.setVote(1, [{checked: false}, {checked: true}]);
test2.setVote(3, [{checked: false}, {checked: true}]);
test2.setVote(5, [{checked: false}, {checked: false}]);
console.log(test2.getResult());
console.log(test2.getBestOption());
console.log(test2.getInvalid());
