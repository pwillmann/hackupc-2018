import * as React from 'react';
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

const StyledHeader = styled.h1`
  margin: 0 0 3rem 0;
  font-size: 3rem;
  font-weight: 700;
`;

export class ConfirmationPage extends React.Component {
  public render() {
    console.log(this.props);
    return (
      <Layout>
        <Wrapper>
          <StyledHeader>Confirm your data</StyledHeader>
        </Wrapper>
      </Layout>
    );
  }
}
