import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import * as React from 'react';
import { PostProps, postsToCamelCase } from '../../Props/Post';
import { theme } from '../style/palette';
import FormGroup, { FieldType } from '../../utils/form';
import { GroupProps } from '../../Props/Group';

export function FormPost(props: {
  mode?: 'create' | 'edit';
  open: boolean;
  onClose: () => void;
  post?: PostProps;
  onUpdate?: (post: PostProps) => void;
}) {
  const { open, onClose, post, onUpdate, mode } = props;
  const defaultFields: FieldType[] = [
    {
      kind: 'autocomplete',
      endPoint: 'api/group/group',
      label: 'Groupe',
      name: mode === 'edit' ? 'groupSlug' : 'group', // Weird
      getOptionLabel: (option: GroupProps) => {
        return option.name;
      },
      required: true,
      helpText:
        mode === 'edit' ? '' : 'Tapez lez 3 premières lettres de votre groupe',
      disabled: mode === 'edit',
    },
    {
      kind: 'text',
      name: 'title',
      label: "Titre de l'annonce",
      required: true,
      rows: 2,
    },
    {
      kind: 'CKEditor',
      label: "Description de l'évènement",
      name: 'description',
    },
    {
      kind: 'date',
      name: 'publicationDate',
      label: 'Date de publication',
      rows: 2,
      type: 'date and time',
    },
    {
      kind: 'picture',
      description: 'Image',
      label: 'Une image un poster une affiche',
      name: 'image',
    },
    {
      kind: 'select',
      name: 'publicity',
      label: 'Visibilté',
      required: true,
      item: [
        ['Public', 'Pub'],
        ['Membres du club uniquement', 'Mem'],
      ],
    },
    {
      kind: 'boolean',
      label: 'Épinglé',
      name: 'pinned',
      rows: 1,
    },
    {
      kind: 'text',
      label: 'Lien vers une page',
      name: 'pageSuggestion',
      rows: 2,
    },
  ];
  const [values, setValues] = React.useState<PostProps>(
    post
      ? structuredClone(post)
      : { group: undefined, publicity: 'Pub', publicationDate: new Date() }
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const deletePost = () => {
    setLoading(true);
    axios
      .delete(`/api/post/${post.id}/`)
      .then(() => {
        onClose();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  const createPost = () => {
    const formData = new FormData();
    console.log(values.image);
    if (values.image && typeof values.image !== 'string')
      formData.append('image', values.image, values.image.name);
    formData.append('group', values.group.toString());
    formData.append('publicity', values.publicity);
    formData.append('title', values.title);
    console.log(values.description);
    formData.append('description', values.description || '<p></p>');
    if (values.pageSuggestion)
      formData.append('page_suggestion', values.pageSuggestion);
    formData.append('publication_date', values.publicationDate.toISOString());
    formData.append('pinned', values.pinned ? 'true' : 'false');
    axios
      .post(`/api/post/`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        postsToCamelCase([res.data]);
        onUpdate(res.data);
      })
      .then(() => {
        onClose();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  const updatePost = () => {
    setLoading(true);
    console.log(values);
    const formData = new FormData();
    // To avoid typescript error
    if (values.image && typeof values.image !== 'string')
      formData.append('image', values.image, values.image.name);
    formData.append('group', post.group.toString());
    formData.append('publicity', values.publicity);
    formData.append('title', values.title);
    formData.append('description', values.description || '<p></p>');
    if (values.pageSuggestion)
      formData.append('page_suggestion', values.pageSuggestion);
    formData.append('publication_date', values.publicationDate.toISOString());
    formData.append('pinned', values.pinned ? 'true' : 'false');
    axios
      .put(`/api/post/${post.id}/`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        postsToCamelCase([res.data]);
        onUpdate(res.data);
      })
      .then(() => {
        onClose();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      fullScreen={fullScreen}
      maxWidth="md"
      sx={{ margin: 0 }}
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {mode === 'edit' ? 'Editer un post' : 'Créer un post'}
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <FormGroup
          fields={defaultFields}
          values={values}
          setValues={setValues}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'right' }}>
        {/* <Button variant="text" sx={{ color: 'GrayText' }} onClick={onClose}>
          Annuler
        </Button> */}
        <div style={{ display: 'flex' }}>
          {mode === 'edit' ? (
            <>
              <Button
                disabled={loading}
                color="warning"
                variant="outlined"
                onClick={deletePost}
                sx={{ marginRight: 1 }}
              >
                Supprimer
              </Button>
              <Button
                disabled={loading}
                color="info"
                variant="contained"
                onClick={updatePost}
              >
                Modifier le post
              </Button>
            </>
          ) : (
            <Button
              disabled={loading}
              color="info"
              variant="contained"
              onClick={createPost}
              sx={{ marginRight: 1 }}
            >
              Créer le post
            </Button>
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}

FormPost.defaultProps = {
  mode: 'edit',
  post: null,
  onUpdate: (post: PostProps) => null,
};
