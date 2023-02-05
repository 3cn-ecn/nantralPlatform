import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Spinner, Button } from "react-bootstrap";
import axios from '../utils/axios';

import { spinnerDivStyle, spinnerStyle } from "../club/clubsList/styles";
import DndTable from "./dndTable";
import { Student, Group, Membership} from './interfaces';
// import { Member } from "./groupMembers/interfaces";
// import { EditGroupMembersModal } from "./editGroupMembers/editGroupMembersModal";
// import { AddGroupMembersModal } from "./editGroupMembers/addGroupMembersModal";
// import { getMembers } from "./groupMembers/utils";

// passed through django template
declare const groupSlug: string;

function MembershipAdminTable(props: {}): JSX.Element {
  const [members, setMembers] = useState<Membership[]>([]);
  const [loadState, setLoadState] = useState<'load' | 'success' | 'fail'>('load');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  // const [selectedMember, setSelectedMember] = useState<Member>(undefined);
  
  useEffect(() => {
    axios.get(`/api/group/membership`, {params: {
      group: groupSlug,
      from: new Date().toISOString()
    }}).then((res) => {
      setMembers(res.data);
      setLoadState('success');
    }).catch(() => setLoadState('fail'));
  }, []);

  const columns = [
    {label: 'Nom', code: 'student.full_name'},
    {label: 'Résumé', code: 'summary'},
    {label: 'Admin', code: 'admin'},
  ]

  return loadState == 'load' ?
    <p>Chargement en cours... ⏳</p>
  : loadState == 'fail' ?
    <p>Échec du chargement 😢</p>
  : 
    <DndTable columns={columns} items={members}/>
}

render(<MembershipAdminTable />, document.getElementById("root-members"));
