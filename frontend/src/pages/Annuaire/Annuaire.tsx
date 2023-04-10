import React, { useState } from 'react';
import {
  Box,
  Tab,
  Button,
  Container,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import axios from 'axios';
import './Annuaire.scss';
import { FilterInterface } from 'Props/Filter';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { StudentProps } from '../../Props/Student';
import FilterBarAnnuaire from '../../components/FilterBarAnnuaire/FilterBarAnnuaire';
import Calendar from '../../components/Calendar/Calendar';
import ModalEditEvent from '../../components/FormularEvent/CreateEvent';
import { LoadStatus } from '../../Props/GenericTypes';

function AnnuaireTable(props: { filter: any }) {
  const { filter } = props;
  const [student, setStudent] = React.useState<StudentProps>([]);
  const [studentStatus, setStudentStatus] = React.useState<LoadStatus>('load');

  const { t } = useTranslation('translation');

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  React.useEffect(() => {
    getListStudent();
    console.log(student);
  }, [filter]);

  async function getListStudent() {
    console.log('1');
    if (filter !== null) {
      debugger;
      axios
        .get('/api/student/student/', {
          params: {
            promo: filter.promo,
            faculty: filter.filiere,
            path: filter.cursus,
          },
        })
        .then((res) => {
          setStudent(res.data);
          setStudentStatus('success');
        })
        .catch((err) => {
          console.error(err);
          setStudentStatus('fail');
        });
    } else {
      axios
        .get('/api/student/student/')
        .then((res) => {
          setStudent(res.data);
          setStudentStatus('success');
        })
        .catch((err) => {
          console.error(err);
          setStudentStatus('fail');
        });
    }
  }

  const fac = {
    Gen: t('profile.gene'),
    Mas: t('profile.master'),
    Iti: t('profile.iti'),
    Doc: t('profile.doc'),
  };

  const path = {
    Cla: null,
    Alt: t('cursus.alternant'),
    'I-M': t('cursus.im'),
    'A-I': t('cursus.ai'),
    'I-A': t('cursus.ia'),
    'I-O': t('cursus.io'),
    'O-I': t('cursus.oi'),
    'M-I': t('cursus.mi'),
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('annuaire.name')}</TableCell>
              <TableCell>{t('annuaire.surname')} </TableCell>
              {matches && <TableCell>{t('annuaire.promo_start')}</TableCell>}
              {matches && <TableCell>{t('annuaire.faculty')}</TableCell>}
              {matches && <TableCell>{t('annuaire.curriculum')}</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {student.map((std) => (
              <TableRow
                key={std.name}
                component={Link}
                to={`/student/${std.id}`}
                sx={{ textDecoration: 'none' }}
              >
                <TableCell component="th" scope="row">
                  {std.name.substring(std.name.indexOf(' ') + 1)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {std.name.substring(0, std.name.indexOf(' '))}
                </TableCell>
                {matches && <TableCell>{std.promo}</TableCell>}
                {matches && <TableCell>{fac[std.faculty]}</TableCell>}
                {matches && <TableCell>{path[std.path]}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {studentStatus === 'load' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress className="loading" />
        </Box>
      )}
    </>
  );
}

function Annuaire() {
  const [filter, setFilter] = React.useState<FilterInterface | null>(null);

  const { t } = useTranslation('translation');

  const getFilter = (validateFilter) => {
    setFilter(validateFilter);
    console.log(filter);
  };

  return (
    <Box>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4">{t('annuaire.student_list')}</Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FilterBarAnnuaire getFilter={getFilter} />
        </div>
        <AnnuaireTable filter={filter} />
      </Container>
    </Box>
  );
}

export default Annuaire;
