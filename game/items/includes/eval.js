module.exports = {
    executeItem: function () {
        console.log(this.eval);
        try {
            eval(this.text);
        } catch (e) {
            console.log(e.stack);
        }
    }
};

