import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';


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
    console.log(ImageUrl)
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
    const {jobOffers} = this.props
    const city = jobOffers.offers[0].city
    const title = jobOffers.offers[0].title
    console.log(jobOffers.offers[0])
    const imageUrl = jobOffers.offers[5].author.uri
    this.getImage(imageUrl)


    return (
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe">
              R
            </Avatar>
          }

          title={title}
          subheader={city}
        />
        <CardMedia
          component='img'
          image="https://lh3.googleusercontent.com/Y34tqM_y2bTS5tc48wGWlGkAiMtwdG7q_pwLOFTpNX6uMb5Pvm5sOiDu1v2dmTkFNhq-uE0=s140"
          title="dsmfsd "
        />
        <CardContent>
          <Typography component="p">
            jfnkdsmflk klkm l
          </Typography>
        </CardContent>
        <CardActions  disableActionSpacing>


        </CardActions>

      </Card>
    );
  }
}



export default withStyles(styles)(JobOfferCard);



//
// export default default withStyles(styles) class JobOfferTemplate extends React.Component {
//   constructor(props: any) {
//     super(props);
//     this.state = { files: [], file: {} };
//   }
//
//   public render() {
//     return (
//       <section>
//         <div>
//                      <Card>test</Card>
//           Here we go
//
//         </div>
//
//       </section>
//     );
//   }
// }
