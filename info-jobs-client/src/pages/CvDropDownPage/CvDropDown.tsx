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
  max-width: 1280px;
  padding: 80px;
`;

export class CvDropDropDown extends React.Component {
  public render() {
    return (
      <Layout>
        <Wrapper>
          <h2>Drop your CV</h2>
          <FileDropZone />
        </Wrapper>
      </Layout>
    );
  }
}
