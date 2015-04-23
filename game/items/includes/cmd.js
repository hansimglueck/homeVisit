var execute = function() {
    this.getWsContent = function() {
        return {
            type: this.type,
            command: this.text,
            param: this.parameter,
            device: this.device
        };
    };
    this.mapToDevice();
};

module.exports = execute;
