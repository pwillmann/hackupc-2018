import * as React from 'react';


export class JobOffers extends React.Component {

  getInfoJobOffers = async() => {
    const clientId = '6a29786cb75a4509874281c77ae4a0ca'
    const clientSecret = 'Xxj8kcjNKhUUY4ceO3ITyB3tf9V1M/eUAG1FS1Vj45ZZuNrwh3'
    const authorizationKey = 'Basic ' + btoa(clientId + ':' + clientSecret)

    const PROXY_URL_PREFIX = 'https://cors-anywhere.herokuapp.com/';
    const BASE_URL = 'https://api.infojobs.net'
    const query = '/api/1/offer'
    const queryUrl = PROXY_URL_PREFIX + BASE_URL + query
    const response = await fetch(queryUrl, {
        method: 'GET',
        headers: {'Authorization': authorizationKey,
                  'Access-Control-Allow-Origin': '*'
        }
    });
    const data = await response.text()

    return data
  }

  public render() {
    this.getInfoJobOffers()
    return (
      <div>
        <h2>Your job Offers</h2>
      </div>

    );
  }
}
