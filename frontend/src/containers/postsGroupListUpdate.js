import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {Button, Card, Modal} from 'react-bootstrap';
import moment from 'moment';

moment().format();

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

function PostsListUpdateDelete(props){
    const [show, setShow] = useState(false);
    const [currentPost, updateCurrentPost] = useState({});
    const [posts, updatePosts] = useState([]);
    const handleClose = () => {
        updateCurrentPost({});
        setShow(false);
    };
    const handleShow = () => setShow(true);
    const getPosts = () => {
        fetch(`/api/post/group/${props.group_slug}/`)
            .then(resp => resp.json()
            .then(posts => {
                updatePosts(posts);
                console.log(posts);
            }));
    };
    useEffect(() => {
        getPosts()
    }, []);
    return <div>
        {posts.length > 0 ? posts.map(post => (<div>
            <Card border={post.color}>
                <Card.Header as="h5">{post.title}</Card.Header>
                {post.image != null &&
                    <Card.Img variant="top" src={`${static_url_prefix}${post.image.url}`} />
                }
                <Card.Body>
                    <Card.Subtitle>Date : {moment(post.publication_date).format("dddd, MMMM Do YYYY, HH:mm")}</Card.Subtitle>
                    <Card.Subtitle>Visibilité : {post.publicity}</Card.Subtitle>
                    <Card.Subtitle>Description :</Card.Subtitle>
                    <Card.Text>
                        {post.description}
                    </Card.Text>
                    <Button href={`/post/${post.slug}/edit`}  variant="primary">Editer cette annonce.</Button>
                    <Button variant="danger" onClick={() => {
                        updateCurrentPost({
                            'title': post.title,
                            'slug': post.slug,
                            'publication_date': post.publication_date
                        });
                        handleShow();
                    }}>Supprimer cette annonce</Button>
                </Card.Body>
                <Card.Footer className="text-center text-muted">{moment(post.publication_date).fromNow()}</Card.Footer>
            </Card>
            </div>
        )) : "C'est un peu mort par ici ... Ajoute vite une annonce, utilise les annonces passées pour t'inspirer."}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Doucement ! On supprime ?</Modal.Title>
        </Modal.Header>
                <Modal.Body>{currentPost['title']}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Enfait non
          </Button>
          <Button variant="danger" onClick={() => {
              axios.delete(`/api/post/${currentPost.slug}`)
              .then(() => {
                    handleClose();
                    getPosts();
                });
          }}>
            Je confirme
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
}

const element = <PostsListUpdateDelete group_slug={group_slug} />;
ReactDOM.render(
    element,
    document.getElementById('root')
);