module.exports = {
    executeItem: function () {
        console.log(this.eval);
        var lang = require('../../gameConf').conf.language;
        try {
            eval(this.text[lang]);
        } catch (e) {
            console.log(e.stack);
        }
    }
};

