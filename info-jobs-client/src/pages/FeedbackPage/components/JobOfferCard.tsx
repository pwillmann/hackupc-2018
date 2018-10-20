import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import styled from 'styled-components';

const OfferContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;

  width: 300px;
  height: 400px;

  margin: 16px;
`;


const HeaderContainer = styled.div`
  margin: 5px;
`;

const Title = styled.h2`
  color: black;
`;

const Link = styled.a`
  text-decoration: none;
`;

const StyledCardHeader = styled(CardHeader)`

`;

const StyledCardMedia = styled(CardMedia)`
  height: 60%;
  width: 100%;
`;


const StyledCardContent = styled(CardContent)`

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
              <StyledCard>
                <StyledCardMedia
                  component='img'
                  image="https://e03-expansion.uecdn.es/assets/multimedia/imagenes/2017/11/30/15120715048392.jpg"
                  title={jobOffer.city}
                />
                <HeaderContainer>
                  <Title>
                    {jobOffer.title}
                  </Title>
                </HeaderContainer>

                <StyledCardHeader
                  title={jobOffer.title}
                  subheader={jobOffer.city}
                />

                <StyledCardContent>
                  <Typography component="p">
                    {jobOffer.author.name}
                  </Typography>
                </StyledCardContent>

              </StyledCard>
          </Link>
      </OfferContainer>

    );
  }
}



export default withStyles(styles)(JobOfferCard);
