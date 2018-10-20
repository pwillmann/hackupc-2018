import * as React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import DomainSummary from './components/DomainSummary';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import { withRouter } from "react-router-dom";

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

const LoadingContainer = styled.div`
  display: flex;
  min-height: 30vh;
  align-items: center;
  justify-content: center;
`;

const StyledHeader = styled.h1`
  margin: 0 0 3rem 0;
  font-size: 3rem;
  font-weight: 700;
`;

const StyledButton = styled(Button)`
  margin: 3rem 0!important;
  float: right;
`;

class Analysis extends React.Component<any, any> {
  state = {
    analysis: null
  };

  componentWillMount = () => {
    //const { username } = this.props;
    const username = 'purdoo';
    this.loadCodeAnalysis(username);
  }

  loadCodeAnalysis = async username => {
    const ENDPOINT = `https://hack-upc.kolja.es/github-stats/${username}`;

    let response = await fetch(ENDPOINT);
    let analysis = await response.json();
    this.setState({ ...this.state, analysis });
  }

  onContinueClick = () => {
    this.props.history.push({
      pathname: '/results',
      state: { analysis: this.state.analysis }
    });
  }

  public render() {
    const { analysis } = this.state;

    let activity : { name: string, value: string }[] = [];
    let popularity : { name: string, value: string }[] = [];
    if (analysis !== null) {
      activity = [
        { name: 'Comments', value: analysis['activity']['tabs']['comments'] },
        { name: 'Pull Requests', value: analysis['activity']['tabs']['pull_request'] }
      ];
      popularity = [
        { name: 'Stars', value: analysis['popularity']['tabs']['stars'] },
        { name: 'Followers', value: analysis['popularity']['tabs']['followers'] }
      ];
    }

    return (
      <Layout>
        <Wrapper>
          <StyledHeader>GitHub Analysis</StyledHeader>
          { analysis ? 
            <div>
              <DomainSummary title='Activity' titleColor={red[500]} data={activity} />
              <DomainSummary title='Popularity' titleColor={green[500]} data={popularity} />
            </div>
            :
              <LoadingContainer>
                <CircularProgress size={48} />
              </LoadingContainer>
          }
          <StyledButton size='large' variant="outlined" color="secondary" disabled={analysis === null} onClick={this.onContinueClick}>Continue</StyledButton>
        </Wrapper>
      </Layout>
    );
  }
}

export default withRouter(Analysis);
