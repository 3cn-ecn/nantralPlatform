import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Form,  Button, Collapse} from 'react-bootstrap';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


function CourseSelector(props) {
    const [open, setOpen] = useState(false);
    const [possibleCourses, setPossibleCourses] = useState([]);
    const [courseType, setCoursesType] = useState([]);
    const [selectedCourse, selectCourse] = useState(null);
    const [courseWhen, SetCourseWhen] = useState("");
    const [followedCourses, setFollowCourses] = useState([]);
    function getCourses(){
        fetch(`/api/student/${props.student_id}/courses/`)
                        .then(response => response.json())
                        .then(courses => {
                            setFollowCourses(courses);
                        })
    }
    useEffect(() => {
        fetch('/api/academic/type')
        .then(response => response.json())
        .then(types => {
            setCoursesType(types);
        });
    }, []);
    useEffect(() => {
        getCourses();
    }, []);
    return <div className='my-3'>
        <h2>Mes cours</h2>
        {
            followedCourses.map(course => (<div>
                {course.course.name} | {course.when}
                <Button variant="danger" onClick={()=>{
                    axios.delete(`/api/student/${props.student_id}/courses/${course.id}`)
                    .then(() => getCourses())
                }}>Supprimer</Button>
                </div>)
            )
        }
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
            <Form.Label>Type de cours</Form.Label>
            <Form.Control as='select' onClick={(event)=>{
                fetch(`/api/academic/${event.target.value}`)
                .then(response => response.json())
                .then(courses => setPossibleCourses(courses))
            }}>
                <option></option>
                {courseType.map(type => (
                    <option key={type[0]} value={type[0]}>{type[0]}</option>
                ))}
            </Form.Control>
            {possibleCourses.length != 0 && <div>
            <Form.Label>Nom du cours</Form.Label>
            <Form.Control as='select' onClick={(event)=>{
                selectCourse(possibleCourses.find(elt => elt.id == event.target.value))
            }}>
                <option></option>
                {possibleCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                ))}
            </Form.Control></div>
            }

            {selectedCourse != null && <div>
            <Form.Label>A quelle occasion as tu suivi ce cours ?</Form.Label>
            <small>On va pas verifier auprès de la scolarité, t'inquiète.</small>
            <Form.Control required={true} as='select' onClick={(event)=>{
                SetCourseWhen(event.target.value)
            }}><option></option>
                {
                selectedCourse.course_type == "OD" &&
                [
                    <option value="EI2">EI2</option>,
                    <option value="EI3">EI3</option>
                ]
                }
                {
                    selectedCourse.course_type == "OP" &&
                    <option value="EI3">EI3</option>
                }
                {
                    selectedCourse.course_type == "ITII" &&
                    <option value="ITII">ITII</option>
                }
                {selectedCourse.course_type == "Master" &&
                     <option value="M1">M1</option> &&
                    <option value="M2">M2</option>
                }
            </Form.Control>
            </div>
            }
        </Form>
        <Button variant='danger' onClick={() => setOpen(!open)}>Annuler</Button>
        <Button variant='success' onClick={() => {
            if (selectedCourse != null) {
                let courseRegistration = {
                    course: selectedCourse.id,
                    when: courseWhen,
                    student: parseInt(props.student_id)
                }
                axios.post(`/api/student/${props.student_id}/courses/`, courseRegistration)
                .then(() => {
                    getCourses();
                    setOpen(!open);
                }
                )
            }
        }}>Enregistrer ce cours</Button>
        </div>
      </Collapse>
    <br></br>
    </div>;
}

const element = <CourseSelector student_id={student_id} />;
ReactDOM.render(
    element,
    document.getElementById('root')
);
