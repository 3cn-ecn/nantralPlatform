import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import { CircularProgress, LinearProgress } from '@mui/material';

export default function CheckboxListSecondary() {
  const [checked, setChecked] = React.useState([1]);
  const [data, setData] = React.useState([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const getData = async () => {
    const studentData = await axios.get('api/student');
    console.log(studentData);
    setData(studentData.data);
    setLoaded(true);
  };

  React.useEffect(() => {
    getData();
  }, []);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const compareFn = (a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    // a must be equal to b
    return 0;
  };

  return (
    <div>
      {loaded ? null : <LinearProgress />}
      <List
        dense
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      >
        {data.sort(compareFn).map((value) => {
          const labelId = value.id;
          return (
            <ListItem
              key={value.id}
              style={{ marginTop: 10 }}
              secondaryAction={
                <Checkbox
                  edge="end"
                  onChange={handleToggle(value)}
                  checked={checked.indexOf(value) !== -1}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              }
              disablePadding
            >
              <ListItemAvatar>
                <Avatar src={value.picture} sizes="10" />
              </ListItemAvatar>
              <ListItemButton>
                <ListItemText id={labelId} primary={value.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
