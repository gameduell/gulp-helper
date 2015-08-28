var unicode = (function(){

    String.prototype.getEachChar = function(cb){
        var newString = this;
        for (var i = 0; i < newString.length; i++) {
            newString[i] = cb(newString[i]);
        }
        return newString.toString();
    }
    var reg = new RegExp('\\\\u([0-9a-fA-F]{4})',"g");
    return {
        encode : function(string){
            if(!string){return '';}
            var newstring = string.replace(reg,
                function (match, submatch) {
                    return String.fromCharCode(parseInt(submatch, 16));
                });
            return newstring;
        },
        decode : function(string){
            return string.getEachChar(function(c){
                for (var i = 0; i < table.length; i++) {
                    if (table[i] == c) {
                        return table[i];
                    }
                }
                return c;
            });
        }

    }
}());

module.exports = unicode;

var table = [
    '\u00C0',
    '\u00C1',
    '\u00C2',
    '\u00C3',
    '\u00C4',
    '\u00C5',
    '\u00C6',
    '\u00C7',
    '\u00C8',
    '\u00C9',
    '\u00CA',
    '\u00CB',
    '\u00CC',
    '\u00CD',
    '\u00CE',
    '\u00CF',
    '\u00D0',
    '\u00D1',
    '\u00D2',
    '\u00D3',
    '\u00D4',
    '\u00D5',
    '\u00D6',
    '\u00D8',
    '\u00D9',
    '\u00DA',
    '\u00DB',
    '\u00DC',
    '\u00DD',
    '\u00DE',
    '\u00DF',
    '\u00E0',
    '\u00E1',
    '\u00E2',
    '\u00E3',
    '\u00E4',
    '\u00E5',
    '\u00E6',
    '\u00E7',
    '\u00E8',
    '\u00E9',
    '\u00EA',
    '\u00EB',
    '\u00EC',
    '\u00ED',
    '\u00EE',
    '\u00EF',
    '\u00F0',
    '\u00F1',
    '\u00F2',
    '\u00F3',
    '\u00F4',
    '\u00F5',
    '\u00F6',
    '\u00F8',
    '\u00F9',
    '\u00FA',
    '\u00FB',
    '\u00FC',
    '\u00FD',
    '\u00FE',
    '\u00FF'
];/**
 * Created by phen on 7/22/15.
 */
