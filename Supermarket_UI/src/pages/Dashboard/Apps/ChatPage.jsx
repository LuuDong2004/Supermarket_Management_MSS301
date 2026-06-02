// pages/Dashboard/Apps/ChatPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialContacts = [
  { id: 1, name: 'Sophia Miller', avatar: '/assets/user-3-Bz6g7hsE.png', status: 'online', unread: 2, lastMsg: 'I have updated the stock report for review.' },
  { id: 2, name: 'Jackson Davis', avatar: '/assets/user-38-Do2kmZ3c.png', status: 'offline', unread: 0, lastMsg: 'Make sure to open the POS at 8:00 AM.' },
  { id: 3, name: 'Emma Wilson', avatar: '/assets/user-51-CsAqIIgX.png', status: 'online', unread: 0, lastMsg: 'The invoice INV-9023 was settled successfully.' },
  { id: 4, name: 'Main Branch Group', avatar: null, status: 'group', unread: 5, lastMsg: 'Staff meeting starts in 15 minutes.' }
];

const initialMessages = {
  1: [
    { sender: 'other', text: 'Hi Lucas, did you check the new batch?', time: '09:30 AM' },
    { sender: 'me', text: 'Yes, iPhone 15 Pro batch is already entered.', time: '09:35 AM' },
    { sender: 'other', text: 'I have updated the stock report for review.', time: '09:40 AM' }
  ],
  2: [
    { sender: 'me', text: 'Hello Jackson, will you open the register tomorrow?', time: 'Yesterday' },
    { sender: 'other', text: 'Make sure to open the POS at 8:00 AM.', time: 'Yesterday' }
  ],
  3: [
    { sender: 'other', text: 'Payment is confirmed.', time: '2 days ago' },
    { sender: 'me', text: 'Excellent, let me dispatch the delivery.', time: '2 days ago' },
    { sender: 'other', text: 'The invoice INV-9023 was settled successfully.', time: '1 day ago' }
  ],
  4: [
    { sender: 'Jackson Davis', text: 'Welcome back to work everyone!', time: '10:00 AM' },
    { sender: 'Sophia Miller', text: 'Is the sales report ready?', time: '10:05 AM' },
    { sender: 'me', text: 'Working on it. Will upload soon.', time: '10:10 AM' },
    { sender: 'Sophia Miller', text: 'Staff meeting starts in 15 minutes.', time: '10:15 AM' }
  ]
};

export default function ChatPage() {
  const [contacts, setContacts] = useState(initialContacts);
  const [messages, setMessages] = useState(initialMessages);
  const [activeContactId, setActiveContactId] = useState(1);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
    // Scroll to bottom of chat history
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeContactId, messages]);

  const activeContact = contacts.find(c => c.id === activeContactId);
  const activeChatMessages = messages[activeContactId] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg]
    }));

    // Update last message in contact list
    setContacts(prev => prev.map(c => c.id === activeContactId ? { ...c, lastMsg: inputText, unread: 0 } : c));
    setInputText('');
  };

  const handleContactClick = (id) => {
    setActiveContactId(id);
    // Reset unread count
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Chat / Messages" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Apps' }, { label: 'Chat' }]} />

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="row g-0 h-100">
          
          {/* Contacts Sidebar List (col-lg-4) */}
          <div className="col-lg-4 border-end h-100 d-flex flex-column">
            <div className="p-3 border-bottom">
              <div className="position-relative">
                <input type="text" className="form-control ps-9" placeholder="Search contact or group..." />
                <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
              </div>
            </div>
            
            <div className="flex-grow-1 overflow-y-auto">
              <div className="list-group list-group-flush">
                {contacts.map(c => {
                  const isActive = c.id === activeContactId;
                  return (
                    <button key={c.id} className={`list-group-item list-group-item-action p-3 d-flex align-items-center gap-3 border-0 rounded-0 ${isActive ? 'bg-primary bg-opacity-10 text-primary-hover' : ''}`} onClick={() => handleContactClick(c.id)}>
                      {c.avatar ? (
                        <div className="position-relative">
                          <img src={c.avatar} alt={c.name} className="rounded-circle size-10" />
                          <span className={`position-absolute bottom-0 end-0 size-2.5 rounded-circle border border-white bg-${c.status === 'online' ? 'success' : 'secondary'}`}></span>
                        </div>
                      ) : (
                        <div className="avatar size-10 rounded-circle bg-indigo text-white d-flex align-items-center justify-content-center fw-bold">
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <h6 className="mb-0 text-truncate fs-15 fw-semibold">{c.name}</h6>
                          {c.unread > 0 && <span className="badge bg-danger rounded-pill fs-xs">{c.unread}</span>}
                        </div>
                        <p className="mb-0 text-muted fs-xs text-truncate">{c.lastMsg}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Chat Window (col-lg-8) */}
          <div className="col-lg-8 h-100 d-flex flex-column">
            {activeContact ? (
              <>
                {/* Chat header */}
                <div className="p-3 border-bottom d-flex align-items-center gap-3 bg-light bg-opacity-20">
                  {activeContact.avatar ? (
                    <img src={activeContact.avatar} alt={activeContact.name} className="rounded-circle size-10" />
                  ) : (
                    <div className="avatar size-10 rounded-circle bg-indigo text-white d-flex align-items-center justify-content-center fw-bold">
                      {activeContact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <div>
                    <h6 className="mb-0 fw-semibold">{activeContact.name}</h6>
                    <span className="text-muted fs-xs d-flex align-items-center gap-1">
                      <span className={`size-1.5 rounded-circle bg-${activeContact.status === 'online' ? 'success' : activeContact.status === 'group' ? 'indigo' : 'secondary'}`}></span>
                      {activeContact.status === 'online' ? 'Online' : activeContact.status === 'group' ? 'Group Chat' : 'Offline'}
                    </span>
                  </div>
                  
                  <div className="ms-auto d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => alert('Voice call')}><i className="ri-phone-line fs-16"></i></button>
                    <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => alert('Video call')}><i className="ri-video-chat-line fs-16"></i></button>
                  </div>
                </div>

                {/* Message list area */}
                <div className="flex-grow-1 p-4 overflow-y-auto bg-light bg-opacity-10 d-flex flex-column gap-3">
                  {activeChatMessages.map((msg, index) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div key={index} className={`d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'}`}>
                        {!isMe && msg.sender !== 'other' && (
                          <span className="text-muted fs-xs mb-1 ms-2">{msg.sender}</span>
                        )}
                        <div className={`p-3 rounded-3 max-w-75 ${
                          isMe ? 'bg-primary text-white rounded-br-0' : 'bg-body-secondary text-reset rounded-bl-0'
                        }`} style={{ maxWidth: '65%' }}>
                          <p className="mb-0 fs-14 text-wrap">{msg.text}</p>
                        </div>
                        <span className="text-muted fs-xs mt-1 px-2">{msg.time}</span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-3 border-top bg-light bg-opacity-25">
                  <form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <button type="button" className="btn btn-icon btn-light" onClick={() => alert('Attach file')}><i className="ri-attachment-2"></i></button>
                    <input type="text" className="form-control" placeholder="Type a message..." value={inputText} onChange={e => setInputText(e.target.value)} />
                    <button type="submit" className="btn btn-primary d-flex align-items-center gap-1 px-4">
                      Send <i className="ri-send-plane-fill"></i>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted">
                <i className="ri-chat-smile-2-line fs-40 mb-2"></i>
                <p>Select a contact or group to start messaging.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
