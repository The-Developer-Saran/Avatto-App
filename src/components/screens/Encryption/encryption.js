const crypto = require('react-native-crypto-js')


const encryptPiDataNew = (data) => {
    try {
        const key = '6d66fb7debfd15bf716bb14752b9603c';
        const iv = '716bb14752b9603c';
        var encrypted = crypto.AES.encrypt(JSON.stringify(data), key, iv).toString();
        return encrypted;
    } catch (e) {
        console.log({ "encryptPiDataNew": e });
    }
}

const decryptPiDataNew = (data) => {
    try {
        const key = '6d66fb7debfd15bf716bb14752b9603c';
        const iv = '716bb14752b9603c';
        const bytes = crypto.AES.decrypt(data, key, iv);
        const data1 = JSON.parse(bytes.toString(crypto.enc.Utf8));
        return data1;
    } catch (e) {
        console.log({ "decryptPiDataNeww": e });
    }
}

const encryptPiDataGift = (data) => {
    try {
        const key = '98AA308826AF4E8B93BF45483AE3418E';
        const iv = '1247B0B192FA391A';
        var encrypted = crypto.AES.encrypt(JSON.stringify(data), key, iv).toString();
        return encrypted;
    } catch (e) {
        console.log({ "encryptPiDataNew": e });
    }
}

const decryptPiDataGift = (data) => {
    try {
        const key = '98AA308826AF4E8B93BF45483AE3418E';
        const iv = '1247B0B192FA391A';
        const alphabetsOnlyData = data.replace(/\s+/g, '+');
        const bytes = crypto.AES.decrypt(alphabetsOnlyData, key, iv);
        const data1 = JSON.parse(bytes.toString(crypto.enc.Utf8));
        return data1;
    } catch (e) {
        console.log({ "decryptPiDataNeww": e });
    }
}

module.exports = {
    encryptPiDataNew,
    decryptPiDataNew,
    encryptPiDataGift,
    decryptPiDataGift,
};