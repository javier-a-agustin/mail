document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector('form').onsubmit = (e) => {
    handleSubmit(e);
  }

  // Dark theme
  const btn = document.querySelector("#btn-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme == "dark") {
    document.body.classList.toggle("dark-theme");
  } else if (currentTheme == "light") {
    document.body.classList.toggle("light-theme");
  }

  btn.addEventListener("click", () => {

    document.querySelector("#btn-toggle").textContent = localStorage.getItem('theme') === 'dark' ? "Dark" : "Light";

    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("light-theme");
      var theme = document.body.classList.contains("light-theme") ?
        "light" :
        "dark";
    } else {
      document.body.classList.toggle("dark-theme");

      var theme = document.body.classList.contains("dark-theme") ?
        "dark" :
        "light";
    }
    localStorage.setItem("theme", theme);
  });

});

/*
 * Fetch the data. Depends on the "url", the fetch it's going to be 
 * to "emails/inbox", "emails/sent" or "emails/archive".
 * Then update the view with the emails.
*/
const getData = (url) => {
  fetch(url)
    .then(response => response.json())
    .then(emails => {
      var item = document.createElement('ul');
      document.querySelector('#emails-view').append(item);

      if (emails.length > 0) {
        emails.forEach(email => {

          item = document.createElement('li');
          item.setAttribute("id", "id" + email.id);
          item.classList.add('list-item');

          if (email.read) {
            item.classList.add('read');
          } else {
            item.classList.add('unread');
          };

          document.querySelector('#emails-view ul').append(item);

          const button = document.createElement('button');
          button.innerHTML = "See";
          button.classList.add('btn');
          button.classList.add('btn-info');
          button.classList.add('button');
          button.setAttribute("id", email.id);
          button.setAttribute('onclick', `displayEmail(${email.id})`);

          const sender = document.createElement('p');
          const timestamp = document.createElement('p');
          const subject = document.createElement('p');

          sender.innerHTML = "From: " + email.sender;
          subject.innerHTML = "Subject: " + email.subject;
          timestamp.innerHTML = email.timestamp

          document.querySelector(`#id${email.id}`).append(button);
          document.querySelector(`#id${email.id}`).append(sender);
          document.querySelector(`#id${email.id}`).append(subject);
          document.querySelector(`#id${email.id}`).append(timestamp);

        });
      } else {
        const item = document.createElement('div');
        item.innerHTML = "Nothing to display";
        document.querySelector('#emails-view').append(item);
      }
    });
}
/*
 * Handle the sent form.
*/
const handleSubmit = (e) => {
  e.preventDefault();
  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(() => load_mailbox('sent'))
    .catch(err => console.error(err));

  return 0;
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

/*
 * Reply an email. Prepopulate the fields with the mail information 
*/
const replyEmail = (subject, timestamp, sender, body) => {
  compose_email();
  document.querySelector("#compose-recipients").value = sender;
  document.querySelector("#compose-subject").value = subject.startsWith("Re: ") ? subject : "Re: " + subject;
  document.querySelector("#compose-body").value = `On ${timestamp} ${sender} wrote: "${body}" `;
}

/*
 * Display an email
*/
const displayEmail = (id) => {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').innerHTML = '';

  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      const sender = document.createElement('p')
      const recipients = document.createElement('div');
      recipients.innerHTML = "<strong>Recipients: </strong>";
      recipients.classList.add('recipients')

      email.recipients.forEach(recipient => {
        const item = document.createElement('p');
        item.innerHTML = recipient;
        recipients.append(item);
      });

      const subject = document.createElement('p');
      const timestamp = document.createElement('p');
      const body = document.createElement('p');

      const back = document.createElement('button');
      back.classList.add('back');
      back.setAttribute('onclick', `load_mailbox('${document.querySelector('h3').textContent}'.toLowerCase())`)
      sender.innerHTML = "<strong>From: </strong>" + email.sender;
      subject.innerHTML = `<strong>${email.subject}</strong>`;
      body.textContent = email.body;
      body.classList.add('body');
      timestamp.innerHTML = email.timestamp;

      document.querySelector('#email').append(back);
      let head = document.createElement('div');
      head.classList.add('head');
      head.append(subject);
      head.append(timestamp);

      document.querySelector('#email').append(head);

      head = document.createElement('div');
      head.classList.add('head');

      head.append(sender);
      head.append(recipients);

      document.querySelector('#email').append(head);
      let hr = document.createElement('hr');
      document.querySelector('#email').append(hr);
      document.querySelector('#email').append(body);

      const reply = document.createElement('button');
      reply.classList.add('btn');
      reply.classList.add('btn-success');
      if (email.sender === document.querySelector('h2').textContent) {
        reply.setAttribute('onclick', `replyEmail('${email.subject}', '${email.timestamp}', '${email.recipients}', '${email.body}')`);
      } else {
        reply.setAttribute('onclick', `replyEmail('${email.subject}', '${email.timestamp}', '${email.sender}', '${email.body}')`);
      }
      reply.textContent = "Reply";


      if (document.querySelector('h3').textContent.toLowerCase() !== 'sent') {
        const archiveUnarchive = document.createElement('button');
        archiveUnarchive.innerHTML = email.archived ? "Unarchive" : "Archive";
        archiveUnarchive.setAttribute('onclick', `setArchiveUnarchive(${email.id}, ${email.archived})`);
        archiveUnarchive.classList.add('btn');
        archiveUnarchive.classList.add('btn-warning');
        document.querySelector('#email').append(archiveUnarchive);
      }

      document.querySelector('#email').append(reply);

      if (!email.read) {
        // If the email is not read, mark it as read.
        fetch(`emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })
      }
    });
}

/* 
 * Archive or unarchve an email
*/
const setArchiveUnarchive = (id, value) => {
  fetch(`emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: !value
      })
    })
    .then(() => {
      displayEmail(id);
    })
    .catch(err => console.error(err))
}

function load_mailbox(mailbox) {
  switch (mailbox) {
    case 'inbox':
      const inbox = '/emails/inbox';
      getData(inbox)
      break;

    case 'sent':
      const sent = 'emails/sent';
      getData(sent);
      break;

    case 'archive':
      const archive = 'emails/archive';
      getData(archive);
      break;
  }

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}