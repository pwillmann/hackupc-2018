import * as React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Summary from './components/Summary';

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  max-width: 1280px;
  padding: 80px;
`;

const LoadingContainer = styled.div`
  display: flex;
  min-height: 30vh;
  align-items: center;
  justify-content: center;
`;

export class Analysis extends React.Component {
  state = {
    analysis: null
  };

  componentWillMount = () => {
    //const { username } = this.props;
    const username = 'kolja-esders';
    this.loadCodeAnalysis(username);
  }

  loadCodeAnalysis = async username => {
    const ENDPOINT = `http://18.217.54.163/github-stats/${username}`;

    let response = await fetch(ENDPOINT);
    let analysis = await response.json();
    this.setState({ ...this.state, analysis });
    console.log(analysis);
  }

  public render() {
    const { analysis } = this.state;

    return (
      <Layout>
        <Wrapper>
          <h1>CV Analysis</h1>
      { analysis ? 
          <Summary data={analysis} />
        :
          <LoadingContainer>
            <CircularProgress size={48} />
          </LoadingContainer>
      }

        </Wrapper>
      </Layout>
    );
  }
}
