import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import * as React from 'react';
import { SvgIcon, Typography } from '@mui/material';
import { ClubSection } from '../../components/Section/ClubSection/ClubSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import './Home.scss';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { isThisWeek } from '../../utils/date';
import { PageSuggestionButton } from '../../components/PageSuggestionButton/PageSuggestionButton';
import { PostSection } from '../../components/Section/PostSection/PostSection';
import { PostProps } from '../../Props/Post';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Home() {
  const [events, setEvents] = React.useState<Array<EventProps>>([]);
  const [eventsStatus, setEventsStatus] = React.useState<
    'load' | 'success' | 'fail'
  >('load');
  const [myClubs, setMyClubs] = React.useState<Array<ClubProps>>([]);
  const [clubsStatus, setClubsStatus] = React.useState<
    'load' | 'success' | 'fail'
  >('load');
  const [posts, setPosts] = React.useState<Array<PostProps>>([]);
  const [postsStatus, setPostsStatus] = React.useState<
    'load' | 'success' | 'fail'
  >('load');
  const { t } = useTranslation('translation'); // translation module
  const headerImageURL =
    'https://www.ec-nantes.fr/medias/photo/carroussel-campus-drone-002_1524738012430-jpg';
  React.useEffect(() => {
    getEvent();
    getMyClubs();
    getPosts();
  }, []);

  async function getEvent() {
    axios
      .get('api/event')
      .then((res) => {
        // setEvents(res.data);
        eventsToCamelCase(res.data);
        setEvents(res.data);
        setEventsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setEventsStatus('fail');
      });
  }
  async function getMyClubs() {
    axios
      .get('api/club/my-clubs')
      .then((res) => {
        setMyClubs(res.data);
        setClubsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setClubsStatus('fail');
      });
  }
  async function getPosts() {
    axios
      .get('api/post')
      .then((res) => {
        setPosts(res.data);
        console.log(res.data);
        setPostsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setPostsStatus('fail');
      });
  }

  return (
    <>
      <div className="header">
        <img className="header-image" alt="" src={headerImageURL} />
        <div id="header-title">
          <Typography id="second-title">{t('home.welcomeTo')}</Typography>
          <div id="title">
            <SvgIcon
              component={NantralIcon}
              inheritViewBox
              sx={{
                height: 50,
                width: 50,
                // display: { xs: 'none', md: 'flex' },
              }}
            />
            <Typography id="main-title">Nantral Platform</Typography>
          </div>
        </div>
      </div>
      <div style={{ alignContent: 'center', display: 'flex', paddingTop: 20 }}>
        <div className="container">
          <PageSuggestionButton
            text={{
              fr: 'Les parrainages arrivent ! Répondez à ce questionnaire pour participer',
              en: 'Parrainages are coming! ANswer this form to participate.',
            }}
            link="/event/"
          />
          <PostSection
            posts={posts.filter((post) => post.pinned)}
            status={postsStatus}
            title="A la une"
          />
          <PostSection
            posts={posts.filter((post) => !post.pinned)}
            status={postsStatus}
            title="Annonces"
          />
          <EventSection
            events={events.filter((item: EventProps) =>
              isThisWeek(new Date(item.beginDate))
            )}
            status={eventsStatus}
            seeMoreUrl="/event"
            title={t('home.thisWeek')}
          />
          <EventSection
            events={events.filter(
              (item: EventProps) => !isThisWeek(new Date(item.beginDate))
            )}
            status={eventsStatus}
            maxItem={3}
            seeMoreUrl="/event"
            title={t('home.upcomingEvents')}
          />
          <ClubSection
            clubs={myClubs}
            status={clubsStatus}
            title={t('home.myClubs')}
            seeMoreUrl="/club"
          />
        </div>
      </div>
    </>
  );
}

export default Home;
