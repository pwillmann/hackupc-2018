import * as React from 'react';
import JobOfferCard from './components/JobOfferCard';
import styled from 'styled-components';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 1280px;
  padding: 80px;
`;



export class JobOffers extends React.Component {
  state = {
    jobOffers: null,
    isLoading: true
  };

  componentWillMount = () => {
    this.getInfoJobOffers('da6a355afd400fa1e44ec6637277d')
  }

  getInfoJobOffers = async(searchVal) => {
    const clientId = '6a29786cb75a4509874281c77ae4a0ca'
    const clientSecret = 'Xxj8kcjNKhUUY4ceO3ITyB3tf9V1M/eUAG1FS1Vj45ZZuNrwh3'
    const authorizationKey = 'Basic ' + btoa(clientId + ':' + clientSecret)

    const searchParams = new URLSearchParams('format=json');
    searchParams.set('q', searchVal);

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
    const jobOffers = await response.json()
    console.log(jobOffers)
    await this.setState({ ...this.state, jobOffers });
    const isLoading = false
    this.setState({ ...this.state, isLoading })
    return null
  }

  public render() {
    const { jobOffers, isLoading } = this.state;
    return (
      <Layout>
         <Wrapper>
          {isLoading ? (
            <div>loading</div>
          ) : (
            <div>
              <h2>Your Job Offers</h2>
              <JobOfferCard jobOffers={jobOffers.offers}/>
            </div>
          )
          }

        </Wrapper>
      </Layout>
    );
  }
}
