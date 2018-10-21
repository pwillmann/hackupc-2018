import * as React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
//import DomainSummary from './components/DomainSummary';
//import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
//import CodeIcon from '@material-ui/icons/Code';
import JobOfferCard from './components/JobOfferCard';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 1280px;
  padding: 80px;
`;

const SignUpWrapper = styled.div`
  width: 100%;
  //padding: 20px 80px;
  background-color: #ff3d00;
  margin-top: 150px;
  min-height: 600px;
  //display: flex;
  //align-items: center;
  //flex-direction: column;
`;

const SignUpWrapperBackground = styled.div`
  overflow: hidden;
  position: absolute;
  width: 8000px;
  margin-left: 2000px;
  height: 400px;
  //background-color: #167DB7;
  background-color: #ff3d00;
  transform-origin: 0;
  margin-top: 90px;
  transform: skewY(-6deg);
  z-index: -1;
`;

const StyledHeader = styled.h1`
  margin: 0 0 3rem 0;
  font-size: 3rem;
  font-weight: 700;
`;

const SignUpButton = styled.button`
  font-size: 1.2rem;
  font-weight: 500;
  padding: 2rem;
  margin: 6rem auto 8rem auto;
  outline: 0;
  border: 0;
  border-radius: 3px;
  background-color: #167DB7;
  color: #fff;
  user-select: none;
  cursor: pointer;
  box-shadow: 0 1px 10px 2px rgba(0, 0, 0, 0.3);
  transition: .2s box-shadow;

  &:hover {
    box-shadow: 0 3px 20px 2px rgba(0, 0, 0, 0.45);
  }
`;

const SignUpExplainer = styled.span`
  font-weight: 400;
  color: #fafafa;
  font-size: 1.5rem;
  line-height: 2.2rem;
  text-align: center;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;

  width: 300px;
  min-height: 200px;
  padding: 1.5rem;

  margin: 0 1rem;

  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 7px rgba(0, 0, 0, 0.02);

  &:first-child {
    margin: 0 1rem 0 0;
  }

  &:last-child {
    margin: 0 0 0 1rem;
  }
`;

const ResultsHeader = styled.h1`
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin: 0 0 2rem 0;
  text-transform: uppercase;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const CodeResults = styled(Results)`
`;

const ResumeResults = styled(Results)`
`;

const Score = styled(CircularProgress)`
  margin: 0 auto;
  width: 150px!important;
  height: 150px!important;
  z-index: 99 !important;
`;

const AvgScoreInner = styled.div`
  margin: -150px auto 0 auto;
  font-size: 1.5rem;
  width: calc(150px - 2 * 17px);
  height: calc(150px - 2 * 17px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #333;
  border: 17px solid ${orange['100']};
`;

const GoodScoreInner = styled.div`
  margin: -150px auto 0 auto;
  font-size: 1.5rem;
  width: calc(150px - 2 * 17px);
  height: calc(150px - 2 * 17px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #333;
  border: 17px solid ${green['100']};
`;

const TodoContainer = styled.div`
  margin-top: 3rem;
`;

const LanguagesContainer = styled.div`
  margin-top: 3rem;
`;

const Todo = styled.div`
  font-size: 1rem;
  line-height: 1.4rem;
  color: #333;
  background-color: #fafafa;
  padding: .2rem .9rem .2rem .4rem;
  border-radius: 3px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.06);
`;

const ProgrammingLanguage = styled.div`
  font-size: 1rem;
  line-height: 1.4rem;
  color: #333;
  background-color: #fafafa;
  padding: 1.1rem;
  border-radius: 3px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.02);
`;

const SignUpInner = styled.div`
  width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SignUpTitle = styled.h1`
  letter-spacing: -2px;
  font-size: 3rem;
  font-weight: 700;
  margin-top: 0rem;
  text-align: center;
  color: #fff;
`;

const BrandLogo = styled.img`
  width: 64px;
  height: 64px;
  margin-bottom: 2rem;
  margin-top: -2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  min-height: 30vh;
  align-items: center;
  justify-content: center;
`;

const JobOfferWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 2rem;
  padding: 16px;
`;

export class Feedback extends React.Component<any, any> {
  state = {
    analysis: null,
    selectedJobOffers: null,
    isLoading: true
  };

  componentWillMount = () => {
    this.getInfoJobOffers()
  }

  getInfoJobOffers = async() => {
    const clientId = '6a29786cb75a4509874281c77ae4a0ca'
    const clientSecret = 'Xxj8kcjNKhUUY4ceO3ITyB3tf9V1M/eUAG1FS1Vj45ZZuNrwh3'
    const authorizationKey = 'Basic ' + btoa(clientId + ':' + clientSecret)

    //const searchParams = new URLSearchParams('format=json');

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
    const selectedJobOffers = jobOffers.offers.splice(0,4)
    await this.setState({ ...this.state, selectedJobOffers });
    const isLoading = false
    this.setState({ ...this.state, isLoading })
    return null
  }

  public render() {
    const { analysis } = this.props.location.state;

    const { selectedJobOffers, isLoading } = this.state;

    let codeColor = analysis.quality.value > 5 ? green[500] : orange[500];

    const colors = [green[50], orange[50], red[50]];

    return (
      <Layout>
        <Wrapper>
          <StyledHeader>Results</StyledHeader>
          <Content>
            <ResumeResults>
              <ResultsHeader>Resume</ResultsHeader>
              <Score value={40} style={{ color: orange[500] }} thickness={5} variant="static">
              </Score>
              <AvgScoreInner>
                4 / 10
              </AvgScoreInner>
              <TodoContainer>
                <Todo>
                  <Checkbox disabled checked/>
                  Keep bullets short
                </Todo>
                <Todo>
                  <Checkbox disabled checked/>
                  Be more quantitative
                </Todo>
                <Todo>
                  <Checkbox disabled checked/>
                  Include your GitHub profile
                </Todo>
              </TodoContainer>
            </ResumeResults>
            <CodeResults>
              <ResultsHeader>Code</ResultsHeader>
              <Score value={analysis.quality.value * 10} style={{ color: codeColor }} thickness={5} variant="static">
              </Score>
              <GoodScoreInner>
                { analysis.quality.value } / 10
              </GoodScoreInner>
              <LanguagesContainer>
                { analysis.quality.tabs.languages.map(l =>
                  <ProgrammingLanguage style={{ backgroundColor: colors[Math.floor(Math.random() * 3)] }}>
                    { l }
                  </ProgrammingLanguage>
                )}
              </LanguagesContainer>
            </CodeResults>
          </Content>
        </Wrapper>
        <SignUpWrapper>
          <SignUpInner>
            <SignUpWrapperBackground  />
            <BrandLogo src='/ij-logo.svg' />
            <SignUpTitle>
              Find Matching Jobs
            </SignUpTitle>
            {isLoading ? (
                <LoadingContainer>
                  <CircularProgress size={48} />
                </LoadingContainer>
              ):(
                <JobOfferWrapper>
                { selectedJobOffers.map(o =>
                    <JobOfferCard jobOffer={o} key={o.id}/>
                )},
              </JobOfferWrapper>
              )
            }
            <SignUpExplainer>
              Join InfoJobs, one of the most popular career websites on the internet.<br/>
              We will automatically find the best jobs for you. Works like magic.<br/><br/>
              Click below to create an InfoJobs account based on your resume.<br/>
            </SignUpExplainer>
            <SignUpButton>
              Create InfoJobs Account
            </SignUpButton>
          </SignUpInner>
        </SignUpWrapper>
      </Layout>
    );
  }
}
