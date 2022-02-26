import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import { Checkbox, Collapse, Divider, Menu, MenuItem, Stack } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CommentIcon from '@mui/icons-material/Comment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import img from "../IMG_20200124_165226.jpg"


const Post = () => {

    const LikesCounter = 1250; 
    const CommentCounter = 170; 
    const ShareCounter = 90;


  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const [openComment, setOpenComment] = React.useState(0);
  const handleCommentClick = () => {
    setOpenComment(!openComment);
  };



  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={img} />
        }
        title="Name"
        subheader="Create Data"
        action={
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Add To favourite</MenuItem>
                <MenuItem onClick={handleClose}>Report</MenuItem>
              </Menu>
            </div>
          }
      />

        <CardContent>
            <Typography variant="body2" color="text.secondary">
            post content
            </Typography>
        </CardContent>

      <CardMedia component="img" height="200" image={img} alt="img" gutterBottom />
      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={3}
      >
          <Typography >{LikesCounter}</Typography>
          <Typography>{CommentCounter}</Typography>
          <Typography>{ShareCounter}</Typography>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={3}
      >
        <Checkbox {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
          
        <IconButton aria-label="share">
          <CommentIcon onClick={handleCommentClick} />
        </IconButton>

        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </Stack>

          
<Collapse in={openComment} timeout="auto" unmountOnExit>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                    secondary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                    </React.Fragment>
                    }
                    />
                    </ListItem >

                    <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                    secondary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                    </React.Fragment>
                    }
                    />
                    </ListItem >

            </List>
          </Collapse>

    

    </Card>
  );
};

export default Post;


/*

<Collapse in={openComment} timeout="auto" unmountOnExit>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Brunch this weekend?"
                    secondary={
                    <React.Fragment>
                    <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                    >
                        Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                    </React.Fragment>
                    }
                    />
                    </ListItem >
                <Divider variant="inset" component="li" />

            </List>
          </Collapse>




*/ 