import { nanoid } from 'nanoid';
import { Component } from 'react';

import ContactForm from 'components/ContactForm/ContactForm';
import ContactList from 'components/ContactList/ContactList';
import ContactsFilter from 'components/Filter/Filter';

import css from './Contacts.module.css';

class Contacts extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = JSON.parse(localStorage.getItem('my-contacts'));
    if (contacts && contacts.length) {
      this.setState({ contacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { contacts } = this.state;
    if (prevState.contacts.length !== contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  addContact = ({ name, number }) => {
    if (this.isDublicate(name)) {
      return alert(`${name} is already in contacts`);
    }

    this.setState(prevState => {
      const { contacts } = prevState;
      const newContact = {
        id: nanoid(),
        name,
        number,
      };

      return { contacts: [newContact, ...contacts], name: '', number: '' };
    });
  };

  handleFilter = ({ target }) => {
    this.setState({ filter: target.value });
  };

  removeContact = id => {
    this.setState(({ contacts }) => {
      const newContact = contacts.filter(contact => contact.id !== id);
      return { contacts: newContact };
    });
  };

  isDublicate(name) {
    const normalizedName = name.toLowerCase();
    const { contacts } = this.state;
    const result = contacts.find(({ name }) => {
      return name.toLowerCase() === normalizedName;
    });

    return Boolean(result);
  }

  getFilteredContacts() {
    const { filter, contacts } = this.state;

    if (!filter) {
      return contacts;
    }

    const normalizedName = filter.toLowerCase();
    const result = contacts.filter(({ name }) => {
      return name.toLowerCase().includes(normalizedName);
    });

    return result;
  }

  render() {
    const { addContact, removeContact, handleFilter } = this;
    const contacts = this.getFilteredContacts();

    return (
      <div>
        <h2 className={css.title}>Phonebook</h2>
        <ContactForm onSubmit={addContact} />
        <ContactsFilter
          handleChange={handleFilter}
          value={this.state.filter}
        />
        <h2 className={css.title}>Contacts</h2>
        <ContactList removeContact={removeContact} contacts={contacts} />
      </div>
    );
  }
}

export default Contacts;