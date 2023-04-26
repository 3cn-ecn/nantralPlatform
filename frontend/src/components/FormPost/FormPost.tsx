import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { Close, Delete } from '@mui/icons-material';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';

import { createPost, deletePost, updatePost } from '#api/post';
import { FieldType } from '#types/GenericTypes';
import { SimpleGroupProps } from '#types/Group';
import { FormPostProps, PostProps } from '#types/Post';
import FormGroup from '#utils/form';

import { ConfirmationModal } from '../Modal/ConfirmationModal';

export function FormPost(props: {
  /** The mode to use this form */
  mode?: 'create' | 'edit';
  /** Whether the form is open */
  open: boolean;
  /** When form is closed */
  onClose: () => void;
  /** Pre-filled post values */
  post?: PostProps;
  /** Send the new post updated */
  onUpdate?: (post: FormPostProps) => void;
  /** When the post is deleted */
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
          pinned: post.pinned,
          createdAt: post.createdAt,
          publicity: post.publicity,
          title: post.title,
        }
      : {
          title: null,
          group: null,
          publicity: 'Pub',
          createdAt: new Date(),
          description: '',
        }
  );
  const [errors, setErrors] = React.useState<any>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [confirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);
  const theme = useTheme();
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  const { data: adminGroup } = useQuery<SimpleGroupProps[], string>({
    queryKey: 'admin-group',
    queryFn: () =>
      axios
        .get('/api/group/group/', {
          params: { simple: true, limit: 20, admin: true },
        })
        .then((res) => res.data.results),
  });
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
      name: 'createdAt',
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

  React.useEffect(() => {
    setValues(
      post
        ? structuredClone(post)
        : { group: undefined, publicity: 'Pub', createdAt: new Date() }
    );
  }, [post]);

  const handleDelete = () => {
    setLoading(true);
    deletePost(post.id)
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

  const handleCreate = () => {
    createPost(values)
      .then((res) => {
        onUpdate(res);
        onClose();
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrors(err.response.data);
        setLoading(false);
      });
  };
  const handleUpdate = () => {
    setLoading(true);
    // Making sure group is group id
    values.group = post.group.id;
    setValues({ ...values, group: post.group.id });
    updatePost(post.id, values)
      .then((res: FormPostProps) => {
        console.log('hey', res);
        setValues(
          post
            ? structuredClone(post)
            : {
                group: undefined,
                publicity: 'Pub',
                createdAt: new Date(),
              }
        );
        onUpdate(res);
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
              startIcon={<Delete />}
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
                  onClick={handleUpdate}
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
                onClick={handleCreate}
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
          if (value) handleDelete();
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
