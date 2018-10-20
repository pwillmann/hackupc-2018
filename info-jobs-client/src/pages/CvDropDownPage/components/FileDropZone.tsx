import * as React from 'react';
import Dropzone from 'react-dropzone';

export default class FileDropZone extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { files: [] };
  }

  public onDrop(files) {
    this.setState({
      files,
    });
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