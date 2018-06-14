//'use strict';

import AuthService from './components/AuthService';

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
    console.log("target utl: " + jsUrl);
    /*if (jsUrl.includes('000webhostapp')) {
        PHP_url = jsUrl;
    }*/
    if (jsUrl.includes('localhost')) {
        PHP_url = window.location.protocol + "//localhost";
    }else if (jsUrl.includes('10.0.1.3')) {
        PHP_url = window.location.protocol + "//10.0.1.3";
    } else{
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

export function myFetch_1(type, url, userData) {
    return new Promise((resolve, reject) =>{
        fetch(PHP_url+url, {
            method: type,
            body: JSON.stringify(userData),
            headers: {
                'Accept': 'application/json',
            }
        }).then((response) => response.json())
          .then((res) => {
                resolve(res);
          })
          .catch((error) => {
                reject(error);
          });
    });
}

export function myFetch(type, url, userData) {
    return fetch(PHP_url+url, {
        method: type,
        body: JSON.stringify(userData),
        headers: {
            'Accept': 'application/json',
        }
    }).then(response => {
        const contentType = response.headers.get('Content-Type') || '';
        if (response.ok) {

            if (contentType.includes('application/json')) {
                return response.json().catch(error => {
                    return Promise.reject(new Error('Invalid JSON: ' + error.message));
                });
            }

            if (contentType.includes('text/html')) {
                return response.text().then(html => {
                    return {
                        page_type: 'generic',
                        html: html
                    };
                }).catch(error => {
                    return Promise.reject(new Error('HTML error: ' + error.message));
                })
            }

            return Promise.reject(new Error('Invalid content type: ' + contentType));
        }

        if (response.status === 401) {
            return Promise.reject(new Error('Uživatel není přihlášen'));
        }

        if (response.status === 404) {
            return Promise.reject(new Error('Page not found: ' + url));
        }

        if (contentType.includes('text/plain')) {
            return response.text().then(body => {
                return Promise.reject(new Error('Chyba: ' + body.toString() +  ' '));
            })
        }
        return Promise.reject(new Error('Chyba: ' + response.body.toLocaleString() +  ' '));
        //return Promise.reject(new Error('Chyba: ' + response.body.toString() +  ' ' + response.status.toLocaleString()));
    }).catch(error => {
        return Promise.reject(error.message);
    });
}

function getToken(){
    let userData = sessionStorage.getItem('userData');
    if(!userData){
        return '';
    }
    let userDataObj = JSON.parse(userData);
    let userDataDetail = userDataObj["userData"];
    if (userDataDetail["token"]){
        return userDataDetail["token"];
    }
    return '';
}

export function myFetchAuth(urlType, url, userData) {
    let auth = new AuthService();
    if (!auth.isLoggedIn()){
        return Promise.reject(new Error('Uživatel není přihlášen'));
    };

    let myHeaders = new Headers();
    myHeaders.append('Authorization', "Bearer " + getToken());
    myHeaders.append('Accept', 'application/json');

    let myInit = {
        method: urlType,
        headers: myHeaders,
        body: JSON.stringify(userData),
    };

    return fetch(PHP_url+url, myInit).then(response => {
        if (response.ok) {
            const contentType = response.headers.get('Content-Type') || '';

            if (contentType.includes('application/json')) {
                return response.json().catch(error => {
                    return Promise.reject(new Error('Invalid JSON: ' + error.message));
                });
            }

            if (contentType.includes('text/html')) {
                return response.text().then(html => {
                    return {
                        page_type: 'generic',
                        html: html
                    };
                }).catch(error => {
                    return Promise.reject(new Error('HTML error: ' + error.message));
                })
            }

            return Promise.reject(new Error('Invalid content type: ' + contentType));
        }

        if (response.status === 401) {
            return Promise.reject(new Error('Uživatel není přihlášen'));
        }

        if (response.status === 404) {
            return Promise.reject(new Error('Page not found: ' + url));
        }

        return Promise.reject(new Error('Chyba: ' + response.status + ' ' +response.body.toString()));
    }).catch(error => {
        return Promise.reject(error.message);
    });
}