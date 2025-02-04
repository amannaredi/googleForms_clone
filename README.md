
# Google Forms Clone

This repository contains a simple web application that mimics the functionality of Google Forms. Users can create forms, fill them out, and view the submitted responses. It is built with HTML, CSS, JavaScript, and EJS templating.

## Features

- **Create Forms**: Users can create new forms with different input types.
- **Submit Forms**: After filling out a form, users can submit their responses.
- **Form Review**: Users can review their form entries before submission.
- **Success & Failure Pages**: Upon submission, users will be directed to success or failure pages based on their submission status.

## Technologies Used

- **HTML**: For the structure and content of the forms.
- **CSS**: For styling the web pages.
- **JavaScript**: For handling form validation and dynamic behavior.
- **EJS**: Templating engine for rendering views on the server side.

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/amannaredi/googleForms_clone.git
   cd googleForms_clone
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000` to interact with the Google Forms clone.

## File Structure

- `index.html`: The homepage of the application.
- `signup.html`: The page where users can sign up.
- `already-registered.html`: The page shown if a user is already registered.
- `confirm.html`: Confirmation page after a successful form submission.
- `failure.html`: Page displayed in case of an error.
- `form-update.html`: Page for updating an existing form.
- `success.html`: Success page after a successful submission.
- `review.ejs`: Review page to preview the form before submission.
- `stylesheet.css`: CSS styles for the form pages.
- `app.js`: JavaScript file for handling client-side logic.

