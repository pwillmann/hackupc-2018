import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import red from '@material-ui/core/colors/red';
import styled from 'styled-components';


const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: 500px!important;
`;

const Offer = styled.div`
  display: flex;
  flex-direction: column;

  width: 300px;
  min-height: 200px;
  padding: 1.5rem;

  margin: 0 1rem;

  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px 7px rgba(0, 0, 0, 0.02);

  &:first-child {
    margin: 0 1rem 0 0;
  }

  &:last-child {
    margin: 0 0 0 1rem;
  }
`;

const JobOfferContainer = styled(Offer)`

`;

const OfferContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const HeaderContainer = styled.div`

`;

const Title = styled.h1`
  font-size: 1.4rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin: 2rem 0 2rem 0;
`;

const City = styled.h1`
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  text-align: left;
  margin: 0 0 2rem 0;
`;

const Company = styled.h1`
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  text-align: left;
  margin: 0 0 2rem 0;
`;

const Link = styled.a`
  text-decoration: none;
`;

const StyledCardMedia = styled(CardMedia)`

`;


const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class JobOfferCard extends React.Component<any, any> {


  getImage = async(ImageUrl) => {
    const PROXY_URL_PREFIX = 'https://cors-anywhere.herokuapp.com/';
    const queryUrl = PROXY_URL_PREFIX + ImageUrl;

    const response = await fetch(queryUrl, {
        method: 'GET',
    });
    const imageSrc = await response.text()
    const parser = new DOMParser()
    const xml = parser.parseFromString(imageSrc, "text/xml")

    console.log(imageSrc)
    console.log(xml)
    console.log(xml.getElementsByClassName(".crop-image-large"))
    return imageSrc
  }



  public render() {
    const { jobOffer } = this.props
    const imageUrl = jobOffer.link
    this.getImage(imageUrl)

    return (

      <OfferContainer>

            <Link href={jobOffer.link} key={jobOffer.id}>
              <Content>
                <JobOfferContainer>

                    <StyledCardMedia
                      component='img'
                      image="https://e03-expansion.uecdn.es/assets/multimedia/imagenes/2017/11/30/15120715048392.jpg"
                      title={jobOffer.city}
                    />
                    <HeaderContainer>
                      <Title>{jobOffer.title}</Title>
                    </HeaderContainer>
                    <City>{jobOffer.city}</City>
                    <Company>{jobOffer.author.name}</Company>

                </JobOfferContainer>
              </Content>

          </Link>
      </OfferContainer>

    );
  }
}


export default withStyles(styles)(JobOfferCard);
