import * as React from 'react';
import styled from 'styled-components';

const DataContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 250px;
  min-height: 200px;
  padding: 1.5rem;

  margin: 0 1rem;

  background-color: #fff;
  border-radius: 10px;
  box-shadow: 2px 0 20px 7px rgba(0, 0, 0, 0.02);

  &:first-child {
    margin: 0 1rem 0 0;
  }

  &:last-child {
    margin: 0 0 0 1rem;
  }
`;

const CardHeader = styled.h1`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

const CenteredCardContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Metric = styled.span`
  margin: 0;
  font-size: 7.5rem;
  font-weight: 400;
`;

const DomainHeader = styled.h2`
  font-size: 2.2rem;
`;

export default class DomainSummary extends React.Component<any, any> {
  public render() {
    const { data, titleColor, title } = this.props;

    return (
      <section>
        <DomainHeader style={{ color: titleColor }}>
          { title }
        </DomainHeader>
        <DataContainer>
        { data.map(d =>
          <Card key={d['name']}>
            <CardHeader>
              { d['name'] }
            </CardHeader>
            <CenteredCardContent>
              <Metric>
                { d['value'] }
              </Metric>
            </CenteredCardContent>
          </Card>
        )}
        </DataContainer>
      </section>
    );
  }
}
