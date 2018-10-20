import * as React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const LoadingContainer = styled.div`
  display: flex;
  min-height: 30vh;
  align-items: center;
  justify-content: center;
`;

export default class FileDropZone extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { files: [], file: {}, loading: false };
  }

  public async onDrop(files) {
    this.setState({
      ...this.state,
      loading: true,
    });
    let file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event: any) => {
      this.setState({
        file: event.target.result,
      });
      const response = await axios.post(
        'https://z641yxvmz0.execute-api.eu-central-1.amazonaws.com/dev/cv',
        JSON.stringify({
          file: this.state.file,
          name: files[0].name,
          type: files[0].type,
        }),
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data.result);
      this.setState({
        ...this.state,
        loading: false,
      });
      this.props.history.push({
        pathname: '/confirmation',
        state: { result: response.data.result },
      });
    };
  }

  public render() {
    const { loading } = this.state;
    return loading ? (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    ) : (
      <section>
        <div>
          <Dropzone
            onDrop={files => this.onDrop(files)}
            accept="application/pdf"
          >
            <p>
              Try dropping some files here, or click to select files to upload.
            </p>
          </Dropzone>
        </div>
      </section>
    );
  }
}
