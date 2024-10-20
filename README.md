# Blog.tsx

🚀 **Blog.tsx** is a fully responsive personal blog application built using **Python Flask** and **React.js**. It provides a rich set of features for creating, editing, and managing blog posts, with support for multiple admins and authors. The application is designed for flexibility, ease of use, and content formatting with rich text editing.

## Key Features

- 📝 **Create & Edit Blogs/Articles**: Allows users to easily create and edit blogs or articles with formatting capabilities.
- 🖋 **Rich Text Formatting**: Uses **Quill.js** to provide a rich text editor for enhanced content formatting.
- 👥 **Multiple Admin & Author Support**: Manage multiple admins and authors, allowing for collaborative content creation.
- 🔧 **Admin Pages**: Dedicated admin pages for managing posts, authors, and other content.
- 💻 **Content Manipulation**: Admins have control over content, including creation, editing, and deletion of posts.
- 📱 **Fully Responsive Design**: Built with **vanilla CSS**, ensuring a seamless experience across all devices, from desktops to mobile phones.

## Technologies Used

- **Python Flask**: Back-end framework for API handling and routing.
- **React.js**: Front-end library for building interactive user interfaces.
- **Redis**: Used for caching and session management to improve performance.
- **Quill.js**: Rich text editor for formatting blog posts and articles.
- **SQLAlchemy**: ORM (Object Relational Mapper) used for managing database operations.

Here's the updated installation process for the README:

---

## Installation

1. **Download the Repository**

   - First, download the project folder from GitHub: [Blog.tsx Source Code](https://github.com/Mevinu/Blog.tsx).

2. **Navigate to the Project Directory**

   - Open a terminal and navigate to the project folder:
     ```bash
     cd Blog.tsx
     ```

3. **Activate the Python Environment**

   - While inside the project folder, activate the Python virtual environment:
     ```bash
     source env/bin/activate
     ```

4. **Run the Flask Server**

   - Start the Flask back-end by running:
     ```bash
     python3 app.py
     ```

5. **Add the First User**

   - To create the first default user, run the `add_default_user.py` script:
     ```bash
     python3 add_default_user.py
     ```

6. **Navigate to the Front-End Directory**

   - After setting up the back-end, navigate to the `frontend` folder:
     ```bash
     cd frontend
     ```

7. **Install Front-End Dependencies**

   - Install the necessary dependencies for the front-end:
     ```bash
     npm install
     ```

8. **Run the Front-End**

   - Finally, start the React front-end:
     ```bash
     npm run dev
     ```

9. **Access the Application**
   Open your browser and go to `http://localhost:3000` to access the front-end. The Flask back-end will be running on `http://localhost:5000`.

## Features Breakdown

- **User-Friendly Blog Creation**: Easily write and format blog posts using a rich text editor.
- **Admin & Author Handling**: Manage multiple users with different roles and permissions.
- **Mobile-First Design**: The application is fully responsive and optimized for any device.
- **Content Moderation**: Admins have control over content manipulation, including editing and deleting posts.
  
## Contribution

Feel free to fork the repository, open issues, or submit pull requests to improve the application.


Download the full source code on GitHub: [Blog.tsx Source Code](https://github.com/Mevinu/Blog.tsx).
