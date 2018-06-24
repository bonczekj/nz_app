import moment from "moment/moment";

export const required = value => (value ? undefined : 'Povinné pole');
export const number = value => value && isNaN(Number(value)) ? 'Musí být číslo' : undefined;
export const email = value => {
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Chybná emailová adresa'
        : undefined;
};

export const getFormatDate = date => (date == null) ? '' : moment(date).format('DD.MM.YYYY');
export const getFormatDateMonth = date => (date == null) ? '' : moment(date).format('MM/YYYY');


export const decodeOptionValue = ( value, optionArray ) => {
    if (value === null) {
        return ''
    }else {
        let optionItem = optionArray.find(item => item.value === value);
        if (optionItem !== undefined) {
            return optionItem.text;
        }
    }
}

export const logout= () => {
    sessionStorage.setItem('userData', '');
    sessionStorage.clear();
}

export const arrToObject= (arr) => {
    //assuming header
    var keys = arr[0];
    //vacate keys from main array
    var newArr = arr.slice(1, arr.length);

    var formatted = [],
        data = newArr,
        cols = keys,
        l = cols.length;
    for (var i=0; i<data.length; i++) {
        var d = data[i],
            o = {};
        for (var j=0; j<l; j++)
            o[cols[j]] = d[j];
        formatted.push(o);
    }
    return formatted;
}

export const checkSalesRole = () => {
    let userData = sessionStorage.getItem('userData');
    if(!userData){
        return false;
    }
    let userDataObj = JSON.parse(userData);
    let userDataDetail = userDataObj["userData"];
    if (!userDataDetail["salesData"]){
        return false;
    }
    let role =  (userDataDetail["salesData"] === "1") ? true : false ;
    return role;
}

export const checkTechRole = () => {
    let userData = sessionStorage.getItem('userData');
    if(!userData){
        return false;
    }
    let userDataObj = JSON.parse(userData);
    let userDataDetail = userDataObj["userData"];
    if (!userDataDetail["techData"]){
        return false;
    }
    let role =  (userDataDetail["techData"] === "1") ? true : false ;
    return role;
}

export const getUserName = () => {
    let userData = sessionStorage.getItem('userData');
    if(!userData){
        return 'uživatel nepřihlášen';
    }
    let userDataObj = JSON.parse(userData);
    let userDataDetail = userDataObj["userData"];
    return userDataDetail["firstname"] + " " + userDataDetail["lastname"];
}

export const getArrayPos = (arr, key, value) => {
    for (var i=0; i<arr.length; i++) {
        var d = arr[i];
        if (d[key] === value){
            return i;
        }
    }
    return -1;
}

export const IsSafariBrowser = () => {
    var VendorName=window.navigator.vendor;
    return ((VendorName.indexOf('Apple') > -1) &&
        (window.navigator.userAgent.indexOf('Safari') > -1));
}
