import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';
// import episodes from './episodes/index';
// import quiz from './quiz/index';
import EpisodeList from './episodes/EpisodeList';
import EpisodeShow from './episodes/EpisodeShow';
import EpisodeCreate from './episodes/EpisodeCreate';
import EpisodeEdit from './episodes/EpisodeEdit';
import QuizList from './quizzes/QuizList';
import QuizShow from './quizzes/QuizShow';
import QuizCreate from './quizzes/QuizCreate';
import QuizEdit from './quizzes/QuizEdit';



import AppcenterList from './appCenter/AppcenterList';

import AppcenterGameList from './appCenterGames/AppcenterGameList';
import AppcenterGameShow from './appCenterGames/AppcenterGameShow';
import AppcenterGameCreate from './appCenterGames/AppcenterGameCreate';
import AppcenterGameEdit from './appCenterGames/AppcenterGameEdit';

import AppcenterNoticeList from './appCenterNotices/AppcenterNoticeList';
import AppcenterNoticeShow from './appCenterNotices/AppcenterNoticeShow';
import AppcenterNoticeCreate from './appCenterNotices/AppcenterNoticeCreate';
import AppcenterNoticeEdit from './appCenterNotices/AppcenterNoticeEdit';

import AppcenterUserList from './appCenterUsers/AppcenterUserList';
import AppcenterUserShow from './appCenterUsers/AppcenterUserShow';
import AppcenterUserCreate from './appCenterUsers/AppcenterUserCreate';
import AppcenterUserEdit from './appCenterUsers/AppcenterUserEdit';



// import AppsIcon from '@material-ui/icons/Apps';
// import ViewModuleIcon from '@material-ui/icons/ViewModule';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import CategoryIcon from '@material-ui/icons/Category';
import { createMuiTheme } from '@material-ui/core/styles';
// import Menu from './Menu';
import Dashboard from './Dashboard';
import NotFound from './NotFound';
import LoginPage from './LoginPage';
import LogoutButton from './LogoutButton';
import authProvider from './authProvider';
import jsonServerProvider from 'ra-data-json-server';

const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorSecondary: {
        backgroundColor: '#004b3e',
      }
    },
    RaSimpleFormIterator: {
      root : {
        padding: '30px',
        backgroundColor: 'rgb(250, 250, 251)',
      },
      line: {
        padding: '30px 0',
      }
    }
  },
  palette: {
    primary: {
      main: '#004b3e',
    }
  },
});


const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('token');
  options.headers.set('Authorization', `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = jsonServerProvider('/api', httpClient);


const App = () => (
  <Admin
    title={'CMS'}
    theme={theme}
    //menu={Menu}
    dashboard={Dashboard}
    catchAll={NotFound}
    loginPage={LoginPage}
    logoutButton={LogoutButton}
    authProvider={authProvider}
    dataProvider={dataProvider}>

    {permissions => [
      <Resource name="dashboard" />,

      permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Episode-Reader') > -1 || permissions.indexOf('RESOURCE:::Episode-Writer') > -1 ?
        <Resource
          name="episodes"
          icon={WebAssetIcon}
          list={EpisodeList}
          show={EpisodeShow}
          create={permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Episode-Writer') > -1 ? EpisodeCreate : null}
          edit={permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Episode-Writer') > -1 ? EpisodeEdit : null}
        />
      : null,

      permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Reader') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1 ?
        <Resource
          name="quizzes"
          icon={CategoryIcon}
          list={QuizList}
          show={QuizShow}
          create={permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1 ? QuizCreate : null}
          edit={permissions.indexOf('RESOURCE:::Administrator') > -1 || permissions.indexOf('RESOURCE:::Quiz-Writer') > -1 ? QuizEdit : null}
        />
      : null,

      <Resource
        name="v2/appCenter"
        list={AppcenterList}
        options={{ label: 'AppCenter' }}
      />,
      <Resource
        name="appCenterGames"
        list={AppcenterGameList}
        show={AppcenterGameShow}
        create={AppcenterGameCreate}
        edit={AppcenterGameEdit}
        options={{ label: 'Game' }}
      />,
      <Resource
        name="appCenterNotices"
        list={AppcenterNoticeList}
        show={AppcenterNoticeShow}
        create={AppcenterNoticeCreate}
        edit={AppcenterNoticeEdit}
        options={{ label: 'Notice/Event' }}
      />,
      <Resource
        name="appCenterUsers"
        list={AppcenterUserList}
        show={AppcenterUserShow}
        create={AppcenterUserCreate}
        edit={AppcenterUserEdit}
        options={{ label: 'User' }}
      />,

    ]}
  </Admin>
)

export default App;