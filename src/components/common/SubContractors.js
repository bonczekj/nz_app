import {PHP_url} from "../../PHP_Connector";


export function getSubContractors() {
    return new Promise((resolve, reject) =>{

        let CustOptions = [];
        fetch(PHP_url+'/nz_rest_api_slim/subcontractors', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        }).then((response)  => {
            if (response.status === 200){
                return response.json();
            }
        }).then(json => {
            let index;
            for (index = 0; index < json.length; ++index) {
                let CustOption = {
                    key: json[index].ico,
                    text: json[index].name,
                    value: json[index].ico,
                };
                CustOptions.push(CustOption);
            }
            console.log(CustOptions);
        }).catch(error => {
            reject("error");
        });
    });
}

