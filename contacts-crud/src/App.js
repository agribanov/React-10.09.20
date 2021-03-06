import React from 'react';
import './App.css';

import ContactsList from './components/contactsList/ContactsList';
import ContactForm from './components/contactForm/ContactForm';
import contactsService from './contactsService';

class App extends React.Component {
    state = {
        selectedContact: this.getEmptyContact(),
        contacts: [],
    };

    componentDidMount() {
        contactsService.get().then(({ data }) =>
            this.setState({
                contacts: data,
            })
        );
    }

    getEmptyContact() {
        return {
            // age: 33,
            name: '',
            surname: '',
            phone: '',
        };
    }

    onAddNewBtnClick = () => {
        this.setState({
            selectedContact: this.getEmptyContact(),
        });
    };

    onContactSelect = (contact) => {
        console.log('on select');
        this.setState({
            selectedContact: contact,
        });
    };

    onDelete = (contact) => {
        const contacts = this.state.contacts.filter((el) => el !== contact);

        contactsService.delete(contact.id);
        this.setState({
            contacts,
            selectedContact: this.getEmptyContact(),
        });
    };

    onSave = (contact) => {
        if (contact.id) {
            this.updateContact(contact);
        } else {
            this.createContact(contact);
        }

        this.saveState();
    };

    createContact(contact) {
        contactsService.post('', contact).then(({ data }) => {
            const contacts = [...this.state.contacts, data];

            this.setState({
                contacts,
                selectedContact: data,
            });
        });
    }

    updateContact(contact) {
        contactsService.put(contact.id, contact);
        this.setState({
            contacts: this.state.contacts.map((el) =>
                el.id === contact.id ? contact : el
            ),
            selectedContact: contact,
        });
    }

    saveState(contacts) {
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    restoreState() {
        const data = localStorage.getItem('contacts');

        return data ? JSON.parse(data) : [];
    }

    render() {
        return (
            <>
                <header className="App-header">Contacts App</header>
                <div className="left-panel">
                    <ContactsList
                        contacts={this.state.contacts}
                        onSelect={this.onContactSelect}
                    ></ContactsList>
                    <button
                        onClick={this.onAddNewBtnClick}
                        className="add-new-contact-btn"
                    >
                        Add new
                    </button>
                </div>
                <div className="right-panel">
                    <ContactForm
                        key={this.state.selectedContact.id}
                        contact={this.state.selectedContact}
                        onDelete={this.onDelete}
                        onSave={this.onSave}
                    ></ContactForm>
                </div>
            </>
        );
    }
}

export default App;
