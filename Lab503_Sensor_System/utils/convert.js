// convert.js
module.exports = {
    buf2string: function (buffer) {
        var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x);
        var str = '';
        for (var i = 0; i < arr.length; i++) {
            str += String.fromCharCode(arr[i]);
        }
        return str;
    },
    buf2hex: function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    },
    string2buf: function (str) {
        let val = '';
        for (let i = 0; i < str.length; i++) {
            val += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return new Uint8Array(val.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))).buffer;
    },
    subPackage: function (str) {
        const packageArray = [];
        for (let i = 0; str.length > i; i += 20) {
            packageArray.push(str.substr(i, 20));
        }
        return packageArray;
    }
}