import IDBManager from './idbManager.js';

export let lastQuery = '';

export default class Converter
{
    constructor(idbManager)
    {
        //db to cache files
        this._idbManager = idbManager;
    }

    getAllCurrencies(callBack)
    {
        fetch("https://free.currencyconverterapi.com/api/v5/currencies")
        .then(response => callBack(null, response))
        .catch(error => callBack(error, null));
    }

    //Converts the currency
    convertCurrency(amount, fromCurrency, toCurrency, callBack)
    {
        fromCurrency = encodeURIComponent(fromCurrency);
        toCurrency = encodeURIComponent(toCurrency);
        const query = fromCurrency + '_' + toCurrency;
        lastQuery = query;

        
        const url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;

        //check db contents
        this._idbManager.getQueryValueByID(query, (error, value) => {

            if(error){
                callBack(error);
                return;
            }

            //if no data go to internet
            if(!value){

                fetch(url)
                .catch(error => callBack(error))
                .then(results => 
                {
                    results.json().then(jsonData => 
                        {
                           
                            this._idbManager.saveQueryInDatabase(query, jsonData[query]);

                            let total = jsonData[query] * amount;
                            callBack(null, (Math.round(total * 100) / 100));
                        });
                });                
            }
            //If there is data in db return
            else{
                
                let val = value['value'];
                let total = val * amount;
                callBack(null, (Math.round(total * 100) / 100));
            }
           
        })

    }
}

