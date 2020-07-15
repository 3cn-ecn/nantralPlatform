import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Form,  Button, Collapse} from 'react-bootstrap';

function registerCourse(course_id){
    payload = {
        
    }
    axios.post('/api/academic/register', )
}

function courseSelector(props) {
    const [open, setOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        fetch('/api/academic/od')
        .then(response => response.json())
        .then(courses => {
            setCourses(courses);
        });
    }, []);
    return (
    <div className='my-3'>
        <h2>Mes cours</h2>

        {!open ? <Button
        variant='success'
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        Ajouter un nouveau cours
        </Button> : null}
      <Collapse in={open}>
        <div>
        <Form>
            <Form.Label>Nom du cours</Form.Label>
            <Form.Control as='select'>
                <option></option>
                {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                ))}
            </Form.Control>
        </Form>
        <Button variant='danger' onClick={() => setOpen(!open)}>Annuler</Button>
        <Button variant='success' onClick={registerCourse()}>Enregistrer ce cours</Button>
        </div>
      </Collapse>
    <br></br>
    </div>
    )
}

const element = <courseSelector />;
ReactDOM.render(
  element,
  document.getElementById('root')
);