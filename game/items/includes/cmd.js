module.exports = {
    executeItem: function () {
        this.mapToDevice();
    },
    getWsContent: function () {
        return {
            type: this.type,
            command: this.text,
            param: this.parameter,
            device: this.device
        };
    }
};

