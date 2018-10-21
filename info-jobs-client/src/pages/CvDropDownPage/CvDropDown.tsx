import * as React from 'react';
import styled from 'styled-components';
import FileDropZone from './components/FileDropZone';

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

const StyledHeader = styled.h1`
  margin: 0 0 3rem 0;
  font-size: 3rem;
  font-weight: 700;
`;

export class CvDropDropDown extends React.Component<any, any> {
  public render() {
    const { history } = this.props;
    return (
      <Layout>
        <Wrapper>
          <StyledHeader>CV Quality Checker</StyledHeader>
          <FileDropZone history={history} />
        </Wrapper>
      </Layout>
    );
  }
}
