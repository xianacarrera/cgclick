function initSocket() {
    socket = io();
    login()           
    addConnectionListeners();
    if(isTeacher) addTeacherListeners();
}

let studentData = {};

function addConnectionListeners(){
    socket.on('connect', () => {
        console.log("Connected");
        if (isTeacher) localStorage.setItem("teacherSignature", socket.id);
    });

    socket.on('disconnect', () => {
        console.log("Server has disconnected");
    });

    socket.on('generic_update', (state) => {
        showParametrizationAnswer = state.showParametrizationAnswer;
        listOfParametrizationAnswers = state.studentParametrizationAnswers;
        currentTeacherSlideNumber = state.slide;
        if (!isFollowing && !(showParametrizationAnswer != state.showParametrizationAnswer && slides[currentSlideNumber].type == "question_parametrization")) {
            return;
        }
        console.log("Update", state);
        leaveSlide();
        currentSlideNumber = state.slide;
        console.log(currentSlideNumber)
        console.log(state)
        displaySlide();
        slide_mutex = false;
    });

    socket.on('student_answer', (msg) => {
        console.log("Received answer from the student: ");
        console.log(msg);
        // If the answer should be unique for each student, filter by using msg.student (id of the student)

        if (msg.slide != currentSlideNumber && !msg.answer.midpoint) return;            // The student is not on the right slide
        manageAnswer(msg.answer, msg.student);

        enableOnAnswerButtons(true);
    })

    socket.on('teacher_refresh', (state) => {
        if (!isTeacher) {
            return;
        }
        console.log("Update", state);
        leaveSlide();
        currentSlideNumber = state.slide;
        currentTeacherSlideNumber = state.slide;
        showParametrizationAnswer = state.showParametrizationAnswer;
        listOfParametrizationAnswers = state.studentParametrizationAnswers;
        console.log(state)
        displaySlide();
        slide_mutex = false;  
    })

    socket.on('teacher_showResults', (msg) => {
        if (isTeacher) return;
        if (currentSlideNumber != currentTeacherSlideNumber) return;
        console.log(msg);
        leaveSlide();
        currentSlideNumber = msg.results.slide;
        currentTeacherSlideNumber = msg.results.slide;
        displaySlide(msg.results);
        slide_mutex = false;
    });
}

function addTeacherListeners(){
    socket.on('teacher_update', (data) => {
        console.log(data);
        studentData = data;
        let pathname = new URL(window.location.href).pathname;
        document.getElementById("statusbar").innerHTML = ejs.views_includes_statusbar({id, pathname, "students": studentData});
    })
}

function emitChangeSlide(index) {
    socket.emit('teacher_changeSlide', {
        slide: index,
        id
    });
}

function emitAnswerToTeacher(answer, skip = false) {
    if (isTeacher) return;
    if (currentSlideNumber != currentTeacherSlideNumber && !skip) return;            // The student is not on the right slide
    console.log("Sent answer");
    console.log({
        id,             // Room id
        answer,         // Answer
        student: socket.id,         // Identifies the student (useful for questions where the answer per student is unique)
    })
    socket.emit('student_answer', {
        id,             // Room id
        answer,         // Answer
        student: socket.id,         // Identifies the student (useful for questions where the answer per student is unique)
        slide: currentSlideNumber,
    });
}

function emitSubmit() {
    if (isTeacher) return;
    if (currentSlideNumber != currentTeacherSlideNumber) return;
    socket.emit('student_submit', {
        id             // Room id
    });
}

function emitAnswersToStudents(results, isAnswer = true) {
    results.isAnswer = isAnswer;
    let msg = {
        results,
        id
    }
    console.log("Sending messages");
    console.log(msg)
    socket.emit('teacher_showResults', msg);
}

function manageAnswer(answer, student){
    console.log(slides[currentSlideNumber].type);
    console.log(answer)
    if (answer.midpoint) {
        goodStudentsMidpoint++;
        updateCorrectMidpoint();
        return;
    }
    switch(slides[currentSlideNumber].type){
        case "question_open":
            let answer_container = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
            if (answer_container == null || answer == "" || answer == "\n") return;
            let found = false;
            for (let i = 0; i < answer_container.childElementCount; i++) {
                let ans = answer_container.children[i].querySelector(".answerText");
                if (answer == ans.textContent) {
                    let count = +answer_container.children[i].querySelector(".answerCount").textContent;
                    answer_container.children[i].querySelector(".answerCount").textContent = "" + (count + 1);
                    found = true;
                }
            }
            if (!found) {
                addOpenQuestionNode(answer_container, answer, "1");
            }

            [...answer_container.children]
                .sort((a, b) => parseInt(a.querySelector(".answerCount").textContent) < parseInt(b.querySelector(".answerCount").textContent) ? 1 : -1)
                .forEach(node => answer_container.appendChild(node));
            break;
        case "question_image_parameters":
            if (student in memory_students){            // The student had previously answered this question
                let previous_answer = memory_students[student];
                image_parameters_answers.alpha[previous_answer.alpha]--;
                image_parameters_answers.beta_gamma[previous_answer.beta_gamma]--
            }
            let beta_gamma = answer.beta / answer.gamma;
            memory_students[student] = {
                alpha: answer.alpha,
                beta_gamma: answer.beta / answer.gamma,
            }
            image_parameters_answers.alpha[answer.alpha]++;
            image_parameters_answers.beta_gamma[beta_gamma]++;
            updateImageParametersGraphs();
            addListenerShowAnswersImageParameters();

            break;
        case "question_midpoint":
            goodStudentsMidpoint++;
            updateCorrectMidpoint();
            break;
    }
}




const login = (readonly = false) => socket.emit("generic_login", {id, readonly});