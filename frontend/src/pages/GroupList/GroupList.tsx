import * as React from 'react';
import { useParams } from 'react-router-dom';

import { Container } from '@mui/material';
import { LoadStatus } from 'Props/GenericTypes';
import axios from 'axios';

import { SimpleGroup } from '#components/Group/interfaces';
import { ClubSection } from '#components/Section/ClubSection/ClubSection';

import NotFound from '../NotFound/NotFound';

export function GroupList() {
  const { groupTypeSlug } = useParams();

  const [groupCategory, setCategory] = React.useState(undefined);
  const [groups, setGroups] = React.useState<Array<SimpleGroup>>([]);
  const [groupsStatus, setGroupsStatus] = React.useState<LoadStatus>('loading');

  React.useEffect(() => {
    axios
      .get(`/api/group/grouptype/${groupTypeSlug}`)
      .then((res) => setCategory(res.data));

    axios
      .get('/api/group/group/', {
        params: { type: groupTypeSlug },
      })
      .then((res) => {
        setGroups(res.data.results);
        setGroupsStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setGroupsStatus('error');
      });
  }, []);
  if (groupTypeSlug[0] === '@') return <NotFound />;

  return (
    <Container>
      <h1 className="position-relative">
        {groupCategory && groupCategory.name}
        <a
          href="{% url 'group:create' group_type.slug %}"
          className="btn btn-success btn-lg position-absolute end-0"
        >
          Créer
        </a>
      </h1>
      {/* {% if user.is_superuser %}
    <a href="{% url 'admin:group_grouptype_change' group_type.pk %}" class="btn btn-dark btn-sm" target="_blank" rel="noopener noreferrer">
      <i class="fas fa-shield-alt"></i>&nbsp; Modifier le type
    </a>
    <a href="{% url 'admin:group_group_changelist' %}?group_type__exact={{ group_type.pk}}" class="btn btn-dark btn-sm" target="_blank" rel="noopener noreferrer">
      <i class="fas fa-shield-alt"></i>&nbsp; Voir la liste
    </a>
    <br />
  {% endif %}
  <br />

  {% regroup group_list by get_category as groups_by_category %}

  {% for category in groups_by_category %}
    <h2>{{ category.grouper }}</h2>
    <div class="grille">
      {% for group in category.list %}
        <div class="grille-icon text-center" style="transform: rotate(0)">
          <a href="{{ group.get_absolute_url }}" class="stretched-link">
            <div class="ratio ratio-1x1">
              {% if group.icon %}
                <img src="{{ group.icon|file_url }}" alt=""/>
              {% else %}
                <img src="https://avatars.dicebear.com/api/initials/{{group.short_name}}.svg" alt=""/>
              {% endif %}
            </div>
          </a>
          <h6>
            {{ group.short_name }}
            {% if group.get_sub_category %}
              <br>
              <small class="text-secondary">{{ group.get_sub_category }}</small>
            {% endif %}
          </h6>
        </div>
      {% endfor %}
    </div>
  {% endfor %} */}
      <ClubSection clubs={groups} status={groupsStatus} title="" />
    </Container>
  );
}
