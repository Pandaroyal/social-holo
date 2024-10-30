import Slider from 'react-slick';
import { CardContent, CardMedia } from '@mui/material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Media } from '../features/posts/postsSlice';

const PostMediaSlider = ({ media }: { media: Media[] }) => {
  console.log("media -> ",media && media.length);
  const sliderSettings = {
    dots: (media && media.length > 1),
    infinite: false,
    speed: 500,
    slidesToShow: 1,    // You can change this to show multiple slides at once
    slidesToScroll: 1,
    centerMode: true,
    swipeToSlide: true,
    centerPadding: '0px',
    arrows: false,
  };
  console.log("media -> ",media && media[0].url);
  console.log("media -> ",media && media[0].height);
  return (
    <CardContent sx={{ width: "100%", padding: '0 20px' }}>
      {media && media.length > 0 && (
        <Slider {...sliderSettings}>
          {media.map((mediaObj, index) => (
            <CardMedia
              key={index}
              component="img"
              image={mediaObj.url}
              alt="post"
              sx={{
                position: 'relative',
                left: '50%',
                transform: 'translate(-50%)',
                objectFit: 'contain', 
                width: `${mediaObj.width}px`, // Ensure full-width responsiveness
                height: `${(mediaObj.height > 600 || mediaObj.height < mediaObj.width) ? '300px' : mediaObj.height+'px'}`, // Maintain aspect ratio
                maxWidth: '600px', 
                maxHeight: '600px', 
                margin: '0 auto', // Centers the media content
              }}
            />
          ))}
        </Slider>
      )}
    </CardContent>
  );
};

export default PostMediaSlider;
