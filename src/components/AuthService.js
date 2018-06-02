import {Component} from "react";
import {myFetch} from './../PHP_Connector';

class AuthService extends Component {

    login = (username, password, myFuncOK, myFuncErr) => {
        if(username && password){
            let credetials = {'username': username, 'password': password};
            myFetch( 'POST', '/nz_rest_api_slim/login', credetials).then(
                result => { this.fetchOK(result);
                            myFuncOK();
                            return true;
                             },
                error => {
                    this.fetchERR(error);
                    myFuncErr(error.toString());
                    return true
                }
        )
        }
    };

    fetchOK(result){
        let responseJson = result;
        if(responseJson.userData){
            sessionStorage.setItem('userData',JSON.stringify(responseJson));
            this.setState({redirect: true});
        }
    };
    fetchERR(error){
        this.setState({errorText: error.toString()});
    }

    isLoggedIn(){
        let userData = sessionStorage.getItem('userData');
        if(userData){
            let userDataObj = JSON.parse(userData);
            let userDataDetail = userDataObj["userData"];
            if (userDataDetail["token"]){
                return true;
                return userDataDetail["token"];
            }
        }
        return false;
    }

    isTokenExpired(token) {
        /*try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }*/
    }

}

export default AuthService;
