# Trashmail Node.js Library

A simple Node.js library to generate disposable email addresses, monitor inboxes, and manage temporary emails.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [getAddress()](#getaddress)
  - [revokeAddress()](#revokeaddress)
  - [renewAddress()](#renewaddress)
  - [getInbox()](#getinbox)
  - [onEmail(callback)](#onemailcallback)
  - [stopListening()](#stoplistening)
- [Example](#example)
- [How It Works](#how-it-works)
- [License](#license)

## Requirements

To use this library, make sure you have the following:

- **Node.js** version 12.x or higher
- **npm** (comes with Node.js)
- **axios** for handling HTTP requests

## Installation

1. **Initialize a new Node.js project** (if you haven't already):

   ```bash
   npm init -y
   ```

2. **Install the necessary dependencies**:

   ```bash
   npm install axios
   ```

3. **Download the `trashmail.js` file** or copy the code from this repository to your project.

## Usage

1. **Require the library**:

   ```javascript
   const Trashmail = require('./trashmail');
   ```

2. **Create an instance of the `Trashmail` class** to generate a disposable email.

3. **Listen for incoming emails** with the `onEmail(callback)` method.

## API Reference

### Constructor

```javascript
const trashmail = new Trashmail();
```

Creates a new instance of the `Trashmail` class. On initialization, a new disposable email address and session ID are generated.

### getAddress()

```javascript
trashmail.getAddress();
```

**Returns**:  
The current temporary email address (string).

### revokeAddress()

```javascript
trashmail.revokeAddress();
```

**Returns**:  
`true` (boolean) if the address is successfully revoked. Resets the email address, session ID, and inbox.

### renewAddress()

```javascript
await trashmail.renewAddress();
```

**Returns**:  
The newly generated email address (string) if successful, or `null` if there is an error.

### getInbox()

```javascript
await trashmail.getInbox();
```

**Returns**:  
An array of email messages (JSON objects) in the inbox, or `null` in case of an error.

### onEmail(callback)

```javascript
trashmail.onEmail((newEmails) => {
  console.log('New Emails:', newEmails);
});
```

Registers a callback function that gets invoked whenever new emails arrive in the inbox. The callback receives an array of new email objects.

- **Parameters**:  
  - `callback`: A function that is called with an array of new emails when they arrive.

### stopListening()

```javascript
trashmail.stopListening();
```

Stops the email listener from continuously checking the inbox. Use this to stop polling for new emails when it's no longer needed.

## Example

Here is a very simple usage example that demonstrates how to create an instance of `Trashmail` and register an email listener:

```javascript
const Trashmail = require('./trashmail');

// Create an instance of the Trashmail class
const trashmail = new Trashmail();

// Wait a few seconds for initialization
setTimeout(() => {
  console.log('Email Address:', trashmail.getAddress());
  
  // Listen for incoming emails
  trashmail.onEmail((newEmails) => {
    console.log('New Emails Received:', newEmails);
  });
}, 3000);
```

In this example, after creating the `Trashmail` instance, it waits for the initialization (generating the email address) and then logs the temporary email. It also listens for any new emails and logs them when received.

## How It Works

1. **Initialization**:  
   When you create an instance of the `Trashmail` class, the constructor sends a request to the API to generate a new temporary email address and session ID. These are stored within the instance.

2. **Fetching Inbox**:  
   You can use `getInbox()` to manually fetch the current emails in the inbox. This method makes an API request using the email address and session ID to retrieve the latest inbox contents.

3. **Listening for New Emails**:  
   By using the `onEmail(callback)` method, the library continuously checks for new emails every 3 seconds. If new emails are found (compared to the last fetched inbox), the provided callback function is called with the new emails.

4. **Renewing or Revoking Emails**:  
   If you wish to discard the current email, use `revokeAddress()` to reset it. You can also call `renewAddress()` to fetch a new email address without discarding the `Trashmail` instance.

5. **Stop Listening**:  
   If you no longer want to listen for incoming emails, call `stopListening()` to stop the continuous inbox polling.

## License

This project is licensed under the MIT License.
