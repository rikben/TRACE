// /forest-dashboard/public_html/assets/js/form.js

const ObservationForm = {
    questions: [],
    answers: {},
    currentIndex: 0,
    modal: null,

    async open() {
        if (!AppMap.userLocation) {
            alert('Please get your current location first.');
            return;
        }

        const result = await Api.getQuestions();

        if (!result.success) {
            alert(result.message || 'Could not load questions.');
            return;
        }

        this.questions = result.questions;
        this.answers = {};
        this.currentIndex = 0;

        this.modal = new bootstrap.Modal(
            document.getElementById('observationModal')
        );

        this.render();
        this.modal.show();
    },

    render() {
        const question = this.questions[this.currentIndex];
        const container = document.getElementById('questionContainer');

        container.classList.remove('question-step-visible');

        setTimeout(() => {
            container.innerHTML = this.renderQuestion(question);
            this.restoreAnswer(question);
            this.updateButtons();
            this.updateProgress();

            requestAnimationFrame(() => {
                container.classList.add('question-step-visible');
            });
        }, 120);
    },

    renderQuestion(question) {
        return `
            <div class="question-card">
                <div class="text-muted small mb-2">
                    Question ${this.currentIndex + 1} of ${this.questions.length}
                </div>

                <h2 class="h4 mb-3">${this.escape(question.question_text)}</h2>

                ${question.hint_text ? `
                    <p class="text-muted">${this.escape(question.hint_text)}</p>
                ` : ''}

                ${question.image_path ? `
                    <img
                        src="${this.escape(question.image_path)}"
                        alt=""
                        class="img-fluid rounded mb-3 question-image"
                    >
                ` : ''}

                ${this.renderInput(question)}

                <div
                    id="questionValidation"
                    class="alert alert-danger mt-3 d-none"
                    role="alert"
                ></div>
            </div>
        `;
    },

    renderInput(question) {
        switch (question.question_type) {
            case 'text':
                return `
                    <textarea
                        class="form-control form-control-lg"
                        id="questionInput"
                        rows="4"
                        placeholder="Type your answer..."
                    ></textarea>
                `;

            case 'number':
                return `
                    <input
                        type="number"
                        class="form-control form-control-lg"
                        id="questionInput"
                        min="${question.min_value ?? ''}"
                        max="${question.max_value ?? ''}"
                        placeholder="Enter a number"
                    >
                `;

            case 'boolean':
                return `
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-success btn-lg answer-option" data-value="true">
                            Yes
                        </button>
                        <button class="btn btn-outline-danger btn-lg answer-option" data-value="false">
                            No
                        </button>
                    </div>
                `;

            case 'single_choice':
                return `
                    <div class="d-grid gap-2">
                        ${question.options.map(option => `
                            <button
                                class="btn btn-outline-success btn-lg answer-option"
                                data-value="${this.escape(option.option_value)}"
                            >
                                ${this.escape(option.option_label)}
                            </button>
                        `).join('')}
                    </div>
                `;

            case 'multiple_choice':
                return `
                    <div class="d-grid gap-2">
                        ${question.options.map(option => `
                            <button
                                class="btn btn-outline-success btn-lg answer-option multiple"
                                data-value="${this.escape(option.option_value)}"
                            >
                                ${this.escape(option.option_label)}
                            </button>
                        `).join('')}
                    </div>
                `;

            case 'rating':
                return this.renderRating(question);

            case 'photo':
                return `
                    <input
                        type="file"
                        class="form-control form-control-lg"
                        id="questionInput"
                        accept="image/*"
                        capture="environment"
                    >
                    <div class="form-text">
                        Use your camera and try to capture the full tree.
                    </div>
                `;

            default:
                return `
                    <input
                        type="text"
                        class="form-control form-control-lg"
                        id="questionInput"
                    >
                `;
        }
    },

    renderRating(question) {
        const min = Number(question.min_value ?? 0);
        const max = Number(question.max_value ?? 10);

        let buttons = '';

        for (let value = min; value <= max; value++) {
            buttons += `
                <button
                    class="btn btn-outline-success rating-button answer-option"
                    data-value="${value}"
                >
                    ${value}
                </button>
            `;
        }

        return `
            <div class="rating-grid">
                ${buttons}
            </div>
        `;
    },

    bindCurrentInput() {
        const question = this.questions[this.currentIndex];

        document.querySelectorAll('.answer-option').forEach(button => {
            button.addEventListener('click', () => {
                this.hideValidation();
                const value = button.dataset.value;

                if (question.question_type === 'multiple_choice') {
                    const current = this.answers[question.id] || [];

                    if (current.includes(value)) {
                        this.answers[question.id] = current.filter(item => item !== value);
                        button.classList.remove('active');
                    } else {
                        this.answers[question.id] = [...current, value];
                        button.classList.add('active');
                    }

                    return;
                }

                this.answers[question.id] = value;

                document.querySelectorAll('.answer-option').forEach(item => {
                    item.classList.remove('active');
                });

                button.classList.add('active');

                const autoContinueTypes = [
                    'boolean',
                    'single_choice',
                    'rating'
                ];

                if (autoContinueTypes.includes(question.question_type)) {
                    setTimeout(() => {
                        this.next();
                    }, 350);
                }
            });
        });

        const input = document.getElementById('questionInput');

        if (input) {
            if (question.question_type === 'photo') {
                input.addEventListener('change', () => {
                    this.hideValidation();
                    this.answers[question.id] = input.files[0] || null;
                });
            } else {
                input.addEventListener('input', () => {
                    this.hideValidation();
                    this.answers[question.id] = input.value;
                });
            }
        }
    },

    restoreAnswer(question) {
        const answer = this.answers[question.id];

        this.bindCurrentInput();

        if (answer === undefined) {
            return;
        }

        const input = document.getElementById('questionInput');

        if (input) {
            input.value = answer;
            return;
        }

        document.querySelectorAll('.answer-option').forEach(button => {
            if (Array.isArray(answer)) {
                button.classList.toggle(
                    'active',
                    answer.includes(button.dataset.value)
                );
            } else {
                button.classList.toggle(
                    'active',
                    button.dataset.value === String(answer)
                );
            }
        });
    },

    next() {
        const question = this.questions[this.currentIndex];

        if (!this.isAnswered(question)) {
            this.showValidation('Please answer this question before continuing.');
            return;
        }

        this.hideValidation();

        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.render();
            return;
        }

        this.submit();
    },

    previous() {
        if (this.currentIndex === 0) {
            return;
        }

        this.currentIndex--;
        this.render();
    },

    isAnswered(question) {
        if (!question.required) {
            return true;
        }

        const value = this.answers[question.id];

        if (Array.isArray(value)) {
            return value.length > 0;
        }

        return value !== undefined && value !== null && String(value).trim() !== '';
    },

    async submit() {
        const photoQuestion = this.questions.find(
            question => question.question_type === 'photo'
        );

        const photoFile = photoQuestion
            ? this.answers[photoQuestion.id]
            : null;

        const responses = this.questions
            .filter(question => question.question_type !== 'photo')
            .map(question => ({
                question_id: question.id,
                answer_value: this.answers[question.id] ?? null
            }));

        const finalScoreQuestion = this.questions.find(
            question => question.question_key === 'final_score'
        );

        const finalScore = finalScoreQuestion
            ? Number(this.answers[finalScoreQuestion.id])
            : 0;

        const notesQuestion = this.questions.find(
            question => question.question_key === 'notes'
        );

        const notes = notesQuestion
            ? this.answers[notesQuestion.id] || null
            : null;

        const payload = {
            latitude: AppMap.userLocation.latitude,
            longitude: AppMap.userLocation.longitude,
            accuracy_m: AppMap.userLocation.accuracy,
            final_score: finalScore,
            notes,
            responses
        };

        const result = await Api.submitObservation(payload, photoFile);

        if (!result.success) {
            alert(result.message || 'Something went wrong.');
            return;
        }

        this.modal.hide();

        alert('Observation saved.');

        Observations.load();
    },

    updateButtons() {
        const previousBtn = document.getElementById('previousQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');

        previousBtn.disabled = this.currentIndex === 0;

        nextBtn.textContent = this.currentIndex === this.questions.length - 1
            ? 'Save observation'
            : 'Continue';
    },

    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;

        document.getElementById('questionProgress').style.width = `${progress}%`;
    },

    showValidation(message) {
        const validation = document.getElementById('questionValidation');

        if (!validation) {
            return;
        }

        validation.textContent = message;
        validation.classList.remove('d-none');

        const card = document.querySelector('.question-card');

        if (card) {
            card.classList.remove('question-shake');

            requestAnimationFrame(() => {
                card.classList.add('question-shake');
            });
        }
    },

    hideValidation() {
        const validation = document.getElementById('questionValidation');

        if (!validation) {
            return;
        }

        validation.classList.add('d-none');
    },

    escape(value) {
        if (value === null || value === undefined) {
            return '';
        }

        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('logObservationBtn').addEventListener('click', () => {
        ObservationForm.open();
    });

    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        ObservationForm.next();
    });

    document.getElementById('previousQuestionBtn').addEventListener('click', () => {
        ObservationForm.previous();
    });
});