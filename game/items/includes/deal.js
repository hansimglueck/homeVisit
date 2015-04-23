var execute = function() {
    this.mapToDevice();

    this.getWsContent = function() {
        return {
            type: this.type,
            text: this.text,
            dealType: this.dealType,
            maxSteps: this.maxSteps
        };
    }
};

module.exports = execute;
