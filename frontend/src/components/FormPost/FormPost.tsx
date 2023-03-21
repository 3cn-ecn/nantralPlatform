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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('translation');
  const defaultFields: FieldType[] = [
    {
      kind: 'autocomplete',
      endPoint: 'api/group/group',
      label: t('form.group'),
      name: mode === 'edit' ? 'groupSlug' : 'group', // Clumbsy
      getOptionLabel: (option: GroupProps) => {
        return option.name;
      },
      required: true,
      helpText: mode === 'edit' ? '' : t('form.groupHelpText'),
      disabled: mode === 'edit',
    },
    {
      kind: 'text',
      name: 'title',
      label: t('form.PostTitle'),
      required: true,
      rows: 2,
    },
    {
      kind: 'CKEditor',
      label: t('form.description'),
      name: 'description',
    },
    {
      kind: 'date',
      name: 'publicationDate',
      label: t('form.publicationDate'),
      rows: 2,
      type: 'date and time',
    },
    {
      kind: 'picture',
      description: t('form.imageDescription'),
      label: t('form.image'),
      name: 'image',
    },
    {
      kind: 'select',
      name: 'publicity',
      label: t('form.publicity'),
      required: true,
      item: [
        [t('form.public'), 'Pub'],
        [t('form.membersOnly'), 'Mem'],
      ],
    },
    {
      kind: 'boolean',
      label: t('form.pinned'),
      name: 'pinned',
      rows: 1,
      type: 'checkbox',
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
                {t('form.delete')}
              </Button>
              <Button
                disabled={loading}
                color="info"
                variant="contained"
                onClick={updatePost}
              >
                {t('form.editPost')}
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
              {t('form.createPost')}
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
