# Week 1

## Day 2 (22/11/2022)
Goals of the meeting:
* Define the main features of the projects
* Define the scope of the project
* Get feedback on the viability
* Get an idea of the libraries and extra techonologies we could use
* Define the roles

### Roles for the first week
* Maja - customer, project manager, frontend (second to Giorgio)
* Giorgio - frontend (Bootstrap)
* Xiana - client-side backend developer (socket.io)
* Giulio - server-side backend developer (socket.io)
* Dimitris - tester (and pull request reviewer)

### Goals for Week 1
1. Question types
	* Think of various types of CG-related questions/tasks/interactive elements, e.g.:
		* open question (later displayed as a word cloud?)
		* LaTeX equations as answers?
		* interactive plots (try different gamma values, Phong model coefficients etc.)
		* WebGL rasterization rendering with sliders
		* try to match the sample picture
	* Implement static versions of a few question types
	* Server only serves static questions and checks answers, interactivity is server-side
	* No teacher role necessary for now
2. Create one "room" with a teacher and students where the teacher can show an interactive presentation
    * Use WebSockets to connect the browsers
    * Give different roles to the teacher and students ("log-in" buttons for "teacher" and "student", but max. 1 teacher)
    * Broadcast the teacher's screen to all students, but also allow students to change slides individually (when teacher changes slides, it will move all the students, also the ones without "focus")
3. Create 3 slides with ejs, html and css and decide on the overall design of the website
    * First slide should be "About" page, where it's written what were our goals and what we did in this first week
    * Integrate it with Bootstrap
    * Add URL fragments for easier sharing
    * Add navigation history
4. If we have time: More complex navigation -> change the current slide to a selected slide (browse, maybe even search in slides)
    * Possible for both teacher and students
    * Follow feature for returning to the "follow teacher" mode

### Future goals
1. Rooms (for future iterations)
    * Connect to a specific room via a pin (e.g. kahoot screen)
2. Geometry visualisations (SVG?)
3. Computer graphics interactive features (WebGL?)

### Possible Stretch goals
* Bootstrap (CSS templates)
* SVG (geometry visualisations?)
* WebGL (interactive examples of WebGL rasterization)
   * https://threejs.org/
* Passport.js (logging-in with roles: teacher vs. students)
    * Teachers would have to be authorized users and create an account with a password
* Crypto.js (crypting the passwords)




