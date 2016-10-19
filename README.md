# COBTrainingCalendar
<b>Internal Staff Training Calendar for City of Burnaby</b>

This course calendar was created for internal use by staff at the City of Burnaby in 2015 to streamline the course discovery, course path and registry process.

<a href="https://cdn.rawgit.com/renbot/COBTrainingCalendar/master/entry.html#/" target="_blank">Preview output here</a>

<br>
<b>User and Business Issues</b>

The Departments of Information Technology (IT) and Human Resources (HR) ran two concurrent course calendars for all City staff. One of these course calendars was accessible to staff via an interactive pdf and the other as a printed course calendar. Both registry processes were manually maintained with staff (the users) having to email the deparments (IT and HR) to register for courses. Updates to courses were done manually and for the print-based calendar, this presented a particularly unique issue whereby the solution was for the department to email all City staff that there was an update to the course. 
<br><br>This was creating a major usability issue for City staff with regards to ease of course discovery, course paths and registration as there were two separate calendars presented in very different manners and with different registration processes. Further, from a departmental viewpoint, advising staff of updates to the course calendars was a manual and a resource/time inefficient process. 


<br>
<b>Solution</b><br>

Our team streamlined and combined the two separate calendars into a single microsite, accessible through the City of Burnaby Intranet. Both calendars were being internally maintained by the departments through two separate Outlook calendars which were fed into the microsite so that the front-end displayed an improved interface that allowed users to see courses, course descriptions, course paths and dates with ease. 

The resulting microsite provided users with the following improved functionality:

<ul>
<li>Ability to view course paths/collections and course descriptions by department on a single page instead of on separate pages as in a multi-page pdf or book</li>
<li>Ability to view the course calendar by month, week or day</li>
<li>Ability to search dynamically within an index</li>
<li>Ability to register for courses directly through the microsite</li>
<li>Ability to view on various desktop and tablet resolutions <br>(note: not responsive to mobile viewports) </li>
</ul>

As the two separate calendars were already being maintained internally by the departments through Outlook - utilizing the calendars as a database to feed into the microsite meant that the departments were able to leverage existing processes and programs to make their updates without having to learn significant new patterns. Further more, the resulting microsite provided the departments with the following improved functionality:

<ul>
<li>Ability to maintain course descriptions within the Outlook calendar instead of in a separate text file</li>
<li>Ability to have course updates, including updates to the description or dates dynamically update in the microsite</li>
</ul>


<br>
<b>Process</b><br>

<i>Information Audit and Architecture</i><br>
Our team worked with the deparments to audit all of the information that was required to be included and defined the information architecture and content blocks to guide the page structure of the microsite. 

<i>UX Sketches and Wireframes</i><br>
With a clear understanding of the content, information architecture and defined pages - the UX designer went through the process of defining logical user journeys which defined the flow of information structure within the microsite with close collaboration with developers to ensure that proposed functionality was possible. These sketches were tested and validated internaally within the team and iterations made as necessary. Low fidelity wireframes were tested and validated within the team and with the departments and iterations made as necessary. Finally, the interface was designed via mockups with small iterative changes.

<i>Development and Validation</i><br>
The front and backend development occured concurrently. QA and QC tests were conducted to test the system to ensure that it was pulling from the Outlook database and that updates were being made dynamically. Formal UAT testing was not conducted and informal/internal user testing conducted in lieu. 



<br>
<b>Team</b>
<br>
<a href="https://github.com/davychiu" target="_blank">Davy Chiu</a> - backend development<br>
<a href="http://www.reneemak.com" target="_blank">Renée Mak</a> - UX/UI design, front-end development<br>
Connnie Lee - front-end development<br>
Stephanie Wren - course calendar maintenance for IT<br>
Helen Johnston - course calendar maintenance for HR
