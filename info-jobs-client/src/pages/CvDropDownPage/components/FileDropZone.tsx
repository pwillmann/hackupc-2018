import * as React from 'react';
import Dropzone from 'react-dropzone';

export default class FileDropZone extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { files: [], file: {} };
  }

  public async onDrop(files) {
    this.setState({
      files,
    });
    console.log(files[0]);
    let file = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async (event: any) => {
      this.setState({
        file: event.target.result,
      });
      const response = await fetch(
        'https://z641yxvmz0.execute-api.eu-central-1.amazonaws.com/dev/cv',
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: this.state.file,
            name: files[0].name,
            type: files[0].type,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
    };
  }

  public render() {
    return (
      <section>
        <div>
          <Dropzone onDrop={files => this.onDrop(files)}>
            <p>
              Try dropping some files here, or click to select files to upload.
            </p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>{this.state.files.map(file => console.log(file))}</ul>
        </aside>
      </section>
    );
  }
}
