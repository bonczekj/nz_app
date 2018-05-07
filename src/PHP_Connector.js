//'use strict';

export var PHP_url = "";

/*export const set_PHP_url = () => {
    var jsUrl = window.location.protocol + "//" + window.location.host
    console.log(jsUrl);
    if (jsUrl.includes('000webhostapp')) {
        PHP_url = jsUrl;
    }
    if (jsUrl.includes('localhost')) {
        PHP_url = window.location.protocol + "//loclahost";
    }
    return 0;
}*/

export function set_PHP_url() {
    var jsUrl = window.location.protocol + "//" + window.location.host
    console.log(jsUrl);
    /*if (jsUrl.includes('000webhostapp')) {
        PHP_url = jsUrl;
    }*/
    if (jsUrl.includes('localhost')) {
        PHP_url = window.location.protocol + "//localhost";
    }else{
        PHP_url = jsUrl;
    }
    console.log("PHP_url="+PHP_url);
};

export function PostData(type, userData) {
    return new Promise((resolve, reject) =>{
        fetch(PHP_url+type, {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {
                'Accept': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
}