import * as React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';

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

const StyledSubHeader = styled.h2`
  margin: 0 0 3rem 0;
  font-weight: 700;
`;

export class ConfirmationPage extends React.Component<any, any> {
  public render() {
    console.log(this.props);
    return (
      <Layout>
        <Wrapper>
          <StyledHeader>Confirm your data</StyledHeader>
          <form>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Name"
                margin="normal"
                style={{ margin: 8 }}
                variant="outlined"
                value={
                  this.props.location.state.result.result.name.split(' ')[0]
                }
              />
              <TextField
                id="outlined-name"
                label="Lastname"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                value={
                  this.props.location.state.result.result.name.split(' ')[1]
                }
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Email"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                value={this.props.location.state.result.result.email}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Education"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                rows={3}
                rowsMax={5}
                multiline={true}
                value={this.props.location.state.result.result.education}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Experience"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                rows={3}
                rowsMax={5}
                multiline={true}
                value={this.props.location.state.result.result.experience}
              />
            </FormGroup>
            <StyledSubHeader>
              Languages{' '}
              <ul>
                {this.props.location.state.result.result.languages
                  .split('\n')
                  .map(language => (
                    <li>{language}</li>
                  ))}
              </ul>
            </StyledSubHeader>
          </form>
        </Wrapper>
      </Layout>
    );
  }
}
