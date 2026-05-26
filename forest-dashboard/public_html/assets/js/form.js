// /forest-dashboard/public_html/assets/js/form.js

const ObservationForm = {
    questions: [],
    answers: {},
    currentIndex: 0,
    modal: null,

    async open() {
        this.setLogButtonEnabled(false);

        const result = await Api.getQuestions();

        if (!result.success) {
            alert(result.message || 'Could not load questions.');
            return;
        }

        this.questions = result.questions;
        this.answers = {};
        this.currentIndex = 0;
        this.hideSubmissionFeedback();

        await this.startLocationFlow();
    },

    async startLocationFlow() {
        AppMap.setLocationStatus();

        const bar = document.getElementById('locationConfirmBar');
        const text = document.getElementById('locationConfirmText');
        const confirmBtn = document.getElementById('confirmTreeLocationBtn');
        const improveBtn = document.getElementById('improveTreeLocationBtn');
        const moveBtn = document.getElementById('moveTreeMarkerBtn');

        bar.classList.remove('d-none');

        confirmBtn.disabled = true;
        improveBtn.disabled = true;
        moveBtn.disabled = true;

        text.textContent = 'Finding your location. This may take a few seconds...';

        try {
            const location = await AppMap.getBestLocation({
                durationMs: 9000,
                desiredAccuracy: 10
            });

            text.textContent = this.formatLocationStatus(location);

            confirmBtn.disabled = false;
            improveBtn.disabled = false;
            moveBtn.disabled = false;

        } catch (error) {
            text.textContent = error.message || 'Could not determine your location.';

            improveBtn.disabled = false;

            AppMap.setLocationStatus(
                error.message || 'Could not determine your location.',
                'danger'
            );
        }
    },

    async improveLocation() {
        const text = document.getElementById('locationConfirmText');
        const confirmBtn = document.getElementById('confirmTreeLocationBtn');
        const improveBtn = document.getElementById('improveTreeLocationBtn');
        const moveBtn = document.getElementById('moveTreeMarkerBtn');

        confirmBtn.disabled = true;
        improveBtn.disabled = true;
        moveBtn.disabled = true;

        text.textContent = 'Improving GPS accuracy...';

        try {
            const location = await AppMap.getBestLocation({
                durationMs: 9000,
                desiredAccuracy: 8
            });

            text.textContent = this.formatLocationStatus(location);
            AppMap.setLocationStatus();

            confirmBtn.disabled = false;
            improveBtn.disabled = false;
            moveBtn.disabled = false;

        } catch (error) {
            text.textContent = error.message || 'Could not improve location. You can move the marker manually.';

            confirmBtn.disabled = !AppMap.userLocation;
            improveBtn.disabled = false;
            moveBtn.disabled = !AppMap.userLocation;
        }
    },

    formatLocationStatus(location) {
        const accuracy = location.accuracy === null
            ? 'manually adjusted'
            : `±${Math.round(location.accuracy)} m`;

        return `Marker position: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (${accuracy}).`;
    },

    startManualMarkerMove() {
        if (!AppMap.userLocation) {
            return;
        }

        AppMap.enableManualMarkerMove(true);

        const text = document.getElementById('locationConfirmText');
        text.textContent = 'Tap the map where the tree is located.';

        const bar = document.getElementById('locationConfirmBar');
        bar.classList.remove('d-none');
    },

    confirmLocationAndOpenQuestions() {
        if (!AppMap.userLocation) {
            return;
        }

        AppMap.enableManualMarkerMove(false);

        document.getElementById('locationConfirmBar').classList.add('d-none');

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
                        Use your camera and try to capture the full tree. The photo will be compressed before upload.
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
                input.addEventListener('change', async () => {
                    this.hideValidation();

                    const file = input.files[0] || null;

                    if (!file) {
                        this.answers[question.id] = null;
                        return;
                    }

                    input.disabled = true;

                    try {
                        this.answers[question.id] = await this.compressImage(file);
                    } catch (error) {
                        this.showValidation(error.message || 'Could not process the image.');
                        this.answers[question.id] = null;
                    } finally {
                        input.disabled = false;
                    }
                });
            } else {
                input.addEventListener('input', () => {
                    this.hideValidation();
                    this.answers[question.id] = input.value;
                });
            }
        }
    },

    setLogButtonEnabled(enabled) {
        const button = document.getElementById('logObservationBtn');

        button.disabled = !enabled;
    },

    cancelLocationFlow() {
        AppMap.enableManualMarkerMove(false);

        document.getElementById('locationConfirmBar').classList.add('d-none');

        this.setLogButtonEnabled(true);
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
        this.hideValidation();
        this.hideSubmissionFeedback();
        this.setSubmitting(true);

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

        try {
            const result = await Api.submitObservation(payload, photoFile);

            if (!result.success) {
                this.showSubmissionFeedback(
                    result.message || 'Something went wrong while saving your observation.',
                    'danger'
                );

                this.setSubmitting(false);
                return;
            }

            this.showSubmissionFeedback(
                'Observation saved. Thank you for contributing!',
                'success'
            );

            Observations.load();

            setTimeout(() => {
                this.setSubmitting(false);
                this.modal.hide();

                // Later we can replace this with:
                // ObservationDetails.open(result.observation_id);
            }, 1200);

        } catch (error) {
            this.showSubmissionFeedback(
                'Could not submit the observation. Please check your connection and try again.',
                'danger'
            );

            this.setSubmitting(false);
        }
    },

    updateButtons() {
        const previousBtn = document.getElementById('previousQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');

        previousBtn.disabled = this.currentIndex === 0;

        const nextText = document.getElementById('nextQuestionText');

        nextText.textContent = this.currentIndex === this.questions.length - 1
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

    setSubmitting(isSubmitting) {
        const nextBtn = document.getElementById('nextQuestionBtn');
        const previousBtn = document.getElementById('previousQuestionBtn');
        const nextText = document.getElementById('nextQuestionText');
        const spinner = document.getElementById('nextQuestionSpinner');

        nextBtn.disabled = isSubmitting;
        previousBtn.disabled = isSubmitting || this.currentIndex === 0;

        spinner.classList.toggle('d-none', !isSubmitting);

        if (isSubmitting) {
            nextText.textContent = 'Saving';
        } else {
            this.updateButtons();
        }
    },

    showSubmissionFeedback(message, type = 'success') {
        const feedback = document.getElementById('submissionFeedback');

        if (!feedback) {
            return;
        }

        feedback.className = `alert alert-${type} mt-3`;
        feedback.textContent = message;
    },

    hideSubmissionFeedback() {
        const feedback = document.getElementById('submissionFeedback');

        if (!feedback) {
            return;
        }

        feedback.className = 'alert mt-3 d-none';
        feedback.textContent = '';
    },

    compressImage(file, maxWidth = 1600, quality = 0.75) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Selected file is not an image.'));
                return;
            }

            const reader = new FileReader();

            reader.onload = event => {
                const image = new Image();

                image.onload = () => {
                    const scale = Math.min(1, maxWidth / image.width);
                    const width = Math.round(image.width * scale);
                    const height = Math.round(image.height * scale);

                    const canvas = document.createElement('canvas');

                    canvas.width = width;
                    canvas.height = height;

                    const context = canvas.getContext('2d');

                    context.drawImage(image, 0, 0, width, height);

                    canvas.toBlob(
                        blob => {
                            if (!blob) {
                                reject(new Error('Could not compress image.'));
                                return;
                            }

                            const compressedFile = new File(
                                [blob],
                                this.createCompressedFileName(file.name),
                                {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                }
                            );

                            resolve(compressedFile);
                        },
                        'image/jpeg',
                        quality
                    );
                };

                image.onerror = () => {
                    reject(new Error('Could not load image.'));
                };

                image.src = event.target.result;
            };

            reader.onerror = () => {
                reject(new Error('Could not read image.'));
            };

            reader.readAsDataURL(file);
        });
    },

    createCompressedFileName(originalName) {
        const baseName = originalName
            .replace(/\.[^/.]+$/, '')
            .replace(/[^a-z0-9_-]/gi, '_')
            .toLowerCase();

        return `${baseName || 'tree_photo'}_compressed.jpg`;
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

    document.getElementById('improveTreeLocationBtn').addEventListener('click', () => {
        ObservationForm.improveLocation();
    });

    document.getElementById('moveTreeMarkerBtn').addEventListener('click', () => {
        ObservationForm.startManualMarkerMove();
    });

    document.getElementById('confirmTreeLocationBtn').addEventListener('click', () => {
        ObservationForm.confirmLocationAndOpenQuestions();
    });

    document.getElementById('observationModal').addEventListener('hidden.bs.modal', () => {
        ObservationForm.setLogButtonEnabled(true);
    });

    document.getElementById('observationDetailsModal').addEventListener('show.bs.modal', () => {
        ObservationForm.setLogButtonEnabled(false);
    });

    document.getElementById('observationDetailsModal').addEventListener('hidden.bs.modal', () => {
        ObservationForm.setLogButtonEnabled(true);
    });

    document.getElementById('cancelTreeLocationBtn').addEventListener('click', () => {
        ObservationForm.cancelLocationFlow();
    });
});