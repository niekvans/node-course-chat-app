const expect = require('expect');
var { isRealString } = require('./validations');

describe('Testing validation.js', () => {
    it('Should reject non-string values', () => {
        var result = isRealString(1234);
        expect(result).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var result = isRealString('    ');
        expect(result).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        var result = isRealString('some text here');
        expect(result).toBe(true);
    });
});