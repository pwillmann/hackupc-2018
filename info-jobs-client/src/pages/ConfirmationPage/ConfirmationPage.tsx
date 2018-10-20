import * as React from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';

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

const StyledButton = styled(Button)`
  margin-top: 3rem !important;
  float: right;
`;

export class ConfirmationPage extends React.Component<any, any> {
  state = {
    cvData: {},
  };

  public componentDidMount() {
    const { location } = this.props;
    console.log(location);
    this.setState(
      {
        ...this.state,
        cvData: {
          ...location.state.result,
        },
      },
      () => console.log(this.state)
    );
  }

  public render() {
    const { history } = this.props;

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
                name="firstName"
                style={{ margin: 8 }}
                variant="outlined"
                value={this.props.location.state.result.name.split(' ')[0]}
              />
              <TextField
                id="outlined-name"
                label="Lastname"
                name="lastname"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                value={this.props.location.state.result.name.split(' ')[1]}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Email"
                name="email"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                value={this.props.location.state.result.email}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Github"
                name="github"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                value={
                  'github.com/' + this.props.location.state.result.github.login
                }
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Homepage"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                value={this.props.location.state.result.github.blog}
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="outlined-name"
                label="Location"
                style={{ margin: 8 }}
                margin="normal"
                variant="outlined"
                value={this.props.location.state.result.github.location}
              />
            </FormGroup>
          </form>
          <StyledButton
            size="large"
            variant="outlined"
            color="secondary"
            onClick={() =>
              history.push({
                pathname: '/analysis',
                state: { data: this.state.cvData },
              })
            }
          >
            Continue
          </StyledButton>
        </Wrapper>
      </Layout>
    );
  }
}
