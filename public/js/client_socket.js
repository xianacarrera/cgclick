let socket;

function initSocket() {
    socket = io();
    login()
    addConnectionListeners();
}

function addConnectionListeners() {
    socket.on('connect', () => {
        console.log("Connected");
    });

    socket.on('disconnect', () => {
        console.log("Server has disconnected");
    });

    socket.on('generic_update', (state) => {
        if (!isFollowing) {
            return;
        }
        console.log("Update", state);
        leaveSlide();
        currentSlideNumber = state.slide;
        currentTeacherSlideNumber = state.slide;
        displaySlide();
        slide_mutex = false;
    });

    socket.on('student_answer', (msg) => {
        console.log("Received answer from the student: ");
        console.log(msg.answer);

        // If the answer should be unique for each student, filter by using msg.student (id of the student)

        if (msg.slide != currentSlideNumber) return;            // The student is not on the right slide
        manageAnswer(msg.answer, msg.student);

        enableButtons();
    })

    socket.on('teacher_showResults', (msg) => {
        if (isTeacher) return;
        console.log(msg);
        leaveSlide();
        currentSlideNumber = msg.results.slide;
        currentTeacherSlideNumber = msg.results.slide;
        displaySlide(msg.results);
        slide_mutex = false;
    });
}

function emitChangeSlide(index) {
    socket.emit('teacher_changeSlide', {
        slide: index,
        id
    });
}

function emitAnswerToTeacher(answer) {
    if (isTeacher) return;
    if (currentSlideNumber != currentTeacherSlideNumber) return;            // The student is not on the right slide
    console.log("Sent open answer");
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

function enableButtons() {
    // This switch is not the best solution in terms of scalability (if we want to change the names of the slides), but parametrizing this info
    // in the slides definition would be too cumbersome in terms of refactoring
    switch (slides[currentSlideNumber].type) {
        case "question_open":
            enableOpenAnswerButtons(true);
    }
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


        let answer_container = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
        if (answer_container == null || msg.answer == "" || msg.answer == "\n") return;
        let found = false;
        for (let i = 0; i < answer_container.childElementCount; i++) {
            let ans = answer_container.children[i].querySelector(".answerText");
            if (msg.answer == ans.textContent) {
                let count = +answer_container.children[i].querySelector(".answerCount").textContent;
                answer_container.children[i].querySelector(".answerCount").textContent = "" + (count + 1);
                found = true;
            }
        }
        if (!found) {
            addOpenQuestionNode(answer_container, msg.answer, "1");
        }

        [...answer_container.children]
            .sort((a, b) => parseInt(a.querySelector(".answerCount").textContent) < parseInt(b.querySelector(".answerCount").textContent) ? 1 : -1)
                .forEach(node => answer_container.appendChild(node));

function manageAnswer(answer, student){
    console.log(slides[currentSlideNumber].type);
    switch(slides[currentSlideNumber].type){
        case "question_open":
            let answer_container = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
            if (answer_container == null || msg.answer == "" || msg.answer == "\n") return;
            let found = false;
            for (let i = 0; i < answer_container.childElementCount; i++) {
                let ans = answer_container.children[i].querySelector(".answerText");
                if (msg.answer == ans.textContent) {
                    let count = +answer_container.children[i].querySelector(".answerCount").textContent;
                    answer_container.children[i].querySelector(".answerCount").textContent = "" + (count + 1);
                    found = true;
                }
            }
            if (!found) {
                addOpenQuestionNode(answer_container, msg.answer, "1");
            }

            [...answer_container.children]
                .sort((a, b) => parseInt(a.querySelector(".answerCount").textContent) < parseInt(b.querySelector(".answerCount").textContent) ? 1 : -1)
                .forEach(node => answer_container.appendChild(node));
            break;
        case "question_image_parameters":
            console.log("HERE");
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
            break;
    }
}


const login = (readonly = false) => socket.emit("generic_login", {id, readonly});