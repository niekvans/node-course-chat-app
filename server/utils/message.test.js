const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

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

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = 'The test user';
        var longitude = 123871;
        var latitude = 120398771;

        var result = generateLocationMessage(from,longitude,latitude);
        expect(result.from).toBe(from);
        expect(result.url).toBe(`https://www.google.com/maps?q=${longitude},${latitude}`);
        expect(typeof result.createdAt).toBe('number');
    });
});