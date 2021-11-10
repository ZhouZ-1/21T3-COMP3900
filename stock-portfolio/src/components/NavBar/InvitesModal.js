import { useEffect, useState } from 'react';
import api from '../../api';

import './invitesModalStyles.css';
function InvitesModal(props) {
  const token = sessionStorage.getItem('token');

  const [invites, setInvites] = useState(
    <li type="button" class="list-group-item list-group-item-action">
      ...Loading Invites...
    </li>
  );

  const onAcceptClick = async (sharingID) => {
    await api('collaborate/reply', 'POST', {
      sharing_id: sharingID,
      accepted: true,
    });
    const invites = await getInvites();
    setInvites(invites);
  };

  const onRejectClick = async (sharingID) => {
    await api('collaborate/reply', 'POST', {
      sharing_id: sharingID,
      accepted: false,
    });
    const invites = await getInvites();
    setInvites(invites);
  };

  const getInvites = async () => {
    const response = await api(`collaborate/check?token=${token}`, 'GET');
    console.log('logging received invites', response);
    const invites = response.map(function (item) {
      return (
        <li class="list-group-item list-group-item-action">
          <span>
            {item.owner} invites you to {item.portfolio_name}
          </span>
          <svg
            id="accept"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-plus-circle"
            viewBox="0 0 16 16"
            onClick={() => onAcceptClick(item.sharing_id)}
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <svg
            id="reject"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-dash-circle"
            viewBox="0 0 16 16"
            onClick={() => onRejectClick(item.sharing_id)}
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
          </svg>
        </li>
      );
    });
    if (invites.length === 0) {
      return (
        <li class="list-group-item list-group-item-action">
          You have no invites
        </li>
      );
    }
    return invites;
  };

  useEffect(async () => {
    const invites = await getInvites();
    setInvites(invites);
  }, []);

  return (
    <div
      class="modal fade"
      id="invitesModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="invitesModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              List of invites for collaborative portfolio.
            </h5>
            <button
              type="button"
              class="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ul>{invites}</ul>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default InvitesModal;
