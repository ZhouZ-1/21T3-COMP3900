import { useEffect, useState } from 'react';
import api from '../../api';

import './invitesModalStyles.css';
function InvitesModal(props) {
  const token = sessionStorage.getItem('token');

  const [invites, setInvites] = useState(
    <li type='button' class='list-group-item list-group-item-action'>
      ...Loading Invites...
    </li>
  );

  const onAcceptClick = async (sharingID) => {
    await api('collaborate/reply', 'POST', {
      token: token,
      sharing_id: sharingID,
      accepted: true,
    });
    const invites = await getInvites();
    setInvites(invites);
  };

  const onRejectClick = async (sharingID) => {
    await api('collaborate/reply', 'POST', {
      token: token,
      sharing_id: sharingID,
      accepted: false,
    });
    const invites = await getInvites();
    setInvites(invites);
  };

  const getInvites = async () => {
    const response = await api(`collaborate/check?token=${token}`, 'GET');
    const invites = response.map(function (item) {
      return (
        <li class='list-group-item list-group-item-action'>
          <span>
            {item.owner} invites you to {item.portfolio_name}
          </span>

          <svg
            id='accept'
            className='ms-3'
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='currentColor'
            class='bi bi-person-plus'
            viewBox='0 0 16 16'
            onClick={() => onAcceptClick(item.sharing_id)}
          >
            <path d='M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z' />
            <path
              fill-rule='evenodd'
              d='M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z'
            />
          </svg>

          <svg
            id='reject'
            className='ms-3'
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            fill='currentColor'
            class='bi bi-person-dash'
            viewBox='0 0 16 16'
            onClick={() => onRejectClick(item.sharing_id)}
          >
            <path d='M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z' />
            <path
              fill-rule='evenodd'
              d='M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z'
            />
          </svg>
        </li>
      );
    });
    if (invites.length === 0) {
      return (
        <li class='list-group-item list-group-item-action'>
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
      class='modal fade'
      id='invitesModal'
      tabindex='-1'
      role='dialog'
      aria-labelledby='invitesModalLabel'
      aria-hidden='true'
    >
      <div class='modal-dialog' role='document'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h5 class='modal-title' id='exampleModalLabel'>
              List of invites for collaborative portfolio.
            </h5>
            <button
              type='button'
              class='close'
              data-bs-dismiss='modal'
              aria-label='Close'
            >
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div class='modal-body'>
            <ul>{invites}</ul>
          </div>
          <div class='modal-footer'>
            <button
              type='button'
              class='btn btn-secondary'
              data-bs-dismiss='modal'
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
