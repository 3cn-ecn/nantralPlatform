import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
} from '@mui/material';
import * as React from 'react';

import './PostCard.scss';
import { ArrowForward, Edit, Groups } from '@mui/icons-material';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import { useTranslation } from 'react-i18next';
import { PostProps } from '../../Props/Post';
import { formatDate } from '../../utils/date';
import { PostModal } from '../Modal/PostModal';

export function SeePageButton(props: {
  link: string;
  style?: React.CSSProperties;
}) {
  const { link, style } = props;
  const { t } = useTranslation('translation');
  return (
    <Button
      style={style}
      onClick={(e) => e.stopPropagation()}
      endIcon={<ArrowForward />}
      href={link}
    >
      {t('button.seePage')}
    </Button>
  );
}

export function MembersIcon() {
  const { t } = useTranslation('translation');
  return (
    <Tooltip title={t('event.membersOnly')} arrow>
      <Groups sx={{ marginRight: 1 }} />
    </Tooltip>
  );
}

SeePageButton.defaultProps = {
  style: null,
};
export function PostCard(props: { post: PostProps }) {
  const { post } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [clubDetails, setClubDetails] = React.useState<ClubProps>(undefined);
  React.useEffect(() => {
    axios
      .get(`api/group/group/${post.group_slug}`)
      .then((res) => setClubDetails(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleClick = (event) => {
    event.stopPropagation();
  };
  return (
    <>
      <Card
        variant={post.pinned ? 'outlined' : 'elevation'}
        sx={{
          height: '110px',
          borderColor: 'red',
          borderWidth: 1,
        }}
      >
        <CardActionArea
          id="post-container"
          onClick={() => setOpen(true)}
          disableTouchRipple
        >
          {post.image && (
            <CardMedia src={post.image} id="card-image" component="img" />
          )}
          <CardContent
            style={{
              borderColor: 'red',
              borderWidth: '10px',
              flexDirection: 'column',
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <div>
              <h2 id="post-title">
                {post.publicity === 'Mem' && <MembersIcon />}
                {post.title}
              </h2>
              <p id="post-club">
                {clubDetails && clubDetails.name}
                {' • '}
                {formatDate(new Date(post.publication_date), 'medium')}
              </p>
            </div>
            {clubDetails && clubDetails.is_admin && (
              <Tooltip title="Edit" arrow>
                <IconButton
                  onClick={handleClick}
                  aria-label="settings"
                  style={{ position: 'absolute', right: 0, top: 0 }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {post.page_suggestion && (
              <SeePageButton
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  marginRight: 10,
                  marginBottom: 5,
                }}
                link={post.page_suggestion}
              />
            )}
          </CardContent>
        </CardActionArea>
      </Card>
      <PostModal
        post={post}
        clubDetails={clubDetails}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
