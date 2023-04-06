import { Close } from '@mui/icons-material';
import {
  Alert,
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
import { FieldType } from 'Props/GenericTypes';
import { FormPostProps, PostProps, postsToCamelCase } from '../../Props/Post';
import { theme } from '../style/palette';
import FormGroup from '../../utils/form';
import { GroupProps, SimpleGroupProps } from '../../Props/Group';
import { ConfirmationModal } from '../Modal/ConfirmationModal';

export function FormPost(props: {
  /** The mode to use this form */
  mode?: 'create' | 'edit';
  /** Whether the form is open */
  open: boolean;
  /**  */
  onClose: () => void;
  post?: PostProps;
  /** Send the new post updated */
  onUpdate?: (post: FormPostProps) => void;
  onDelete?: () => void;
}) {
  const { open, onClose, post, onUpdate, mode, onDelete } = props;
  const { t } = useTranslation('translation');
  const [values, setValues] = React.useState<FormPostProps>(
    post
      ? {
          description: post.description,
          group: post.group.id,
          image: post.image,
          pageSuggestion: post.pageSuggestion,
          pinned: post.pinned,
          publicationDate: post.publicationDate,
          publicity: post.publicity,
          title: post.title,
        }
      : {
          title: null,
          group: null,
          publicity: 'Pub',
          publicationDate: new Date(),
          description: '',
        }
  );
  const [errors, setErrors] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [adminGroup, setAdminGroup] = React.useState<Array<GroupProps>>([]);
  const [confirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  let fetching = false;
  const defaultFields: FieldType[] = [
    {
      kind: 'image-autocomplete',
      label: t('form.group'),
      required: true,
      name: 'group',
      options: adminGroup,
      getIcon: (object: SimpleGroupProps) => object.icon,
      getOptionLabel: (object: SimpleGroupProps) => object.name,
      disabled: mode === 'edit',
      helpText: t('form.groupHelpText'),
    },
    {
      kind: 'text',
      name: 'title',
      label: t('form.PostTitle'),
      required: true,
      rows: 2,
    },
    {
      kind: 'richtext',
      label: t('form.description'),
      name: 'description',
    },
    {
      kind: 'datetime',
      name: 'publicationDate',
      label: t('form.publicationDate'),
      rows: 2,
      disablePast: true,
    },
    {
      kind: 'file',
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
      disabled: !post?.canPin,
    },
  ];

  React.useEffect(() => {
    setErrors({});
  }, [open]);

  const fetchAdminGroups = () => {
    if (!fetching) {
      fetching = true;
      console.log(new Date().getMilliseconds(), fetching);
      axios
        .get('/api/group/group/', {
          params: { admin: true, simple: true, limit: 20 },
        })
        .then((res) => setAdminGroup(res.data.results));
    }
  };

  React.useEffect(fetchAdminGroups, []);

  React.useEffect(() => {
    setValues(
      post
        ? structuredClone(post)
        : { group: undefined, publicity: 'Pub', publicationDate: new Date() }
    );
  }, [post]);

  const deletePost = () => {
    setLoading(true);
    axios
      .delete(`/api/post/${post.id}/`)
      .then(() => {
        onUpdate(null);
        onClose();
        setLoading(false);
        onDelete();
      })
      .catch((err) => {
        console.error(err);
        setErrors(err.response.data);
        setLoading(false);
      });
  };
  function createForm(): FormData {
    const formData = new FormData();
    if (values.image && typeof values.image !== 'string')
      formData.append('image', values.image, values.image.name);
    if (values.group && mode === 'create')
      formData.append('group', values.group.toString());
    if (post?.group && mode === 'edit')
      formData.append('group', post.group.id.toString());
    formData.append('publicity', values.publicity);
    formData.append('title', values.title || '');
    formData.append('description', values.description || '<p></p>');
    if (values.pageSuggestion)
      formData.append('page_suggestion', values.pageSuggestion);
    formData.append('publication_date', values.publicationDate.toISOString());
    formData.append('pinned', values.pinned ? 'true' : 'false');
    return formData;
  }

  const createPost = () => {
    axios
      .post(`/api/post/`, createForm(), {
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
        setErrors(err.response.data);
        setLoading(false);
      });
  };
  const updatePost = () => {
    setLoading(true);
    axios
      .put(`/api/post/${post.id}/`, createForm(), {
        headers: {
          'content-type': 'multipart/form-data',
        },
      })
      .then((res) => {
        postsToCamelCase([res.data]);
        setValues(
          post
            ? structuredClone(post)
            : {
                group: undefined,
                publicity: 'Pub',
                publicationDate: new Date(),
              }
        );
        onUpdate(res.data);
      })
      .then(() => {
        onClose();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrors(err.response.data);
        setLoading(false);
      });
  };
  return (
    <>
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
          {mode === 'edit' ? t('form.editPost') : t('form.createAPost')}
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          {errors.nonFieldErrors &&
            errors.nonFieldErrors.map((text) => (
              <Alert variant="filled" severity="error" key={text}>
                {text}
              </Alert>
            ))}

          <div>
            <FormGroup
              fields={defaultFields}
              values={values}
              setValues={setValues}
              errors={errors}
            />
          </div>
          {mode === 'edit' && (
            <Button
              disabled={loading}
              color="warning"
              variant="outlined"
              onClick={() => setConfirmationOpen(true)}
            >
              {t('form.deletePost')}
            </Button>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: 'right' }}>
          <div style={{ display: 'flex' }}>
            {mode === 'edit' ? (
              <>
                <Button
                  disabled={loading}
                  color="inherit"
                  variant="text"
                  onClick={onClose}
                  sx={{ marginRight: 1 }}
                >
                  {t('form.cancel')}
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
                type="submit"
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
      <ConfirmationModal
        title={t('form.deletePost')}
        open={confirmationOpen}
        onClose={(value) => {
          if (value) deletePost();
          setConfirmationOpen(false);
        }}
        content={t('post.confirmDelete')}
      />
    </>
  );
}

FormPost.defaultProps = {
  mode: 'edit',
  post: null,
  onUpdate: () => null,
  onDelete: () => null,
};
