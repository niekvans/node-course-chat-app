const expect = require('expect');

const { generateMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = 'Niek';
        var text = 'This is the test text';
        var result = generateMessage(from, text);

        expect(result.from).toBe(from);
        expect(result.text).toBe(text);
        expect(typeof result.createdAt).toBe('number');
    });

});